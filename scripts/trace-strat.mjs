// Traces the Stratocaster's body, pickguard and headstock outlines from Fender's front
// product photo (3000×980, olive background) for components/room/strat.ts.
//
//   ffmpeg -i front.png -f rawvideo -pix_fmt rgb24 front.rgb
//   node scripts/trace-strat.mjs front.rgb > strat.json
//
// Pixels are classed by colour, the regions cleaned up (open/close/fill), traced with
// Moore-neighbour tracing and simplified (RDP). For strat.ts the outlines were then
// smoothed with two passes of Chaikin subdivision and the tail strap-button nub removed.
import fs from "node:fs";
const [W, H] = [3000, 980];
const px = fs.readFileSync(process.argv[2]);
const cls = new Uint8Array(W * H); // 0 bg 1 maple 2 black 3 white 4 chrome 5 other
for (let i = 0; i < W * H; i++) {
  const r = px[i*3], g = px[i*3+1], b = px[i*3+2];
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
  const dbg = Math.hypot(r-0x71, g-0x68, b-0x4b);
  let c = 5;
  if (dbg < 28) c = 0;
  else if (mx < 70) c = 2;
  else if (mn > 175 && mx - mn < 40) c = 3;
  else if (r > 170 && g > 120 && b < 150 && r - b > 50) c = 1;
  else if (mx - mn < 30) c = 4;
  cls[i] = c;
}
const at = (m, x, y) => x >= 0 && y >= 0 && x < W && y < H && m[y * W + x];
const mask = (f) => { const m = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) m[y*W+x] = f(x, y, cls[y*W+x]) ? 1 : 0; return m; };
function components(m) {
  const lab = new Int32Array(W * H).fill(-1), comps = [];
  for (let i = 0; i < W * H; i++) if (m[i] && lab[i] < 0) {
    const q = [i], c = { id: comps.length, n: 0, sx: 0, sy: 0, minx: W, maxx: 0, miny: H, maxy: 0, px: [] };
    lab[i] = c.id;
    while (q.length) { const j = q.pop(); const x = j % W, y = (j / W) | 0; c.n++; c.sx += x; c.sy += y; c.px.push(j);
      c.minx = Math.min(c.minx, x); c.maxx = Math.max(c.maxx, x); c.miny = Math.min(c.miny, y); c.maxy = Math.max(c.maxy, y);
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const k = j + dx + dy * W; const nx = x+dx, ny = y+dy; if (nx>=0&&ny>=0&&nx<W&&ny<H&&m[k]&&lab[k]<0) { lab[k]=c.id; q.push(k);} } }
    comps.push(c);
  }
  return comps;
}
const only = (c) => { const m = new Uint8Array(W*H); for (const j of c.px) m[j] = 1; return m; };
const largest = (m) => only(components(m).sort((a,b)=>b.n-a.n)[0]);
function fill(m) { // fill holes: flood the outside from the border
  const out = new Uint8Array(W*H), q = [];
  for (let x=0;x<W;x++) for (const y of [0,H-1]) if(!m[y*W+x]) { out[y*W+x]=1; q.push(y*W+x); }
  for (let y=0;y<H;y++) for (const x of [0,W-1]) if(!m[y*W+x]&&!out[y*W+x]) { out[y*W+x]=1; q.push(y*W+x); }
  while (q.length) { const j=q.pop(); const x=j%W,y=(j/W)|0; for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue; const k=ny*W+nx; if(!m[k]&&!out[k]) { out[k]=1; q.push(k);} } }
  const r = new Uint8Array(W*H); for (let i=0;i<W*H;i++) r[i] = out[i] ? 0 : 1; return r;
}
function open(m, r) { // erode then dilate (removes thin bridges/strings)
  const step = (src, keep) => { const d = new Uint8Array(W*H); for (let y=0;y<H;y++) for (let x=0;x<W;x++) { let v = keep; for (let dy=-r;dy<=r&&v===keep;dy++) for (let dx=-r;dx<=r;dx++) if ((at(src,x+dx,y+dy)?1:0) !== keep) { v = 1-keep; break; } d[y*W+x] = v; } return d; };
  return step(step(m, 1), 0);
}
function close(m, r) { // dilate then erode (bridges thin gaps like strings)
  const inv = new Uint8Array(W*H); for (let i=0;i<W*H;i++) inv[i] = m[i] ? 0 : 1;
  const o = open(inv, r); const out = new Uint8Array(W*H); for (let i=0;i<W*H;i++) out[i] = o[i] ? 0 : 1; return out;
}
function trace(m) { // Moore-neighbour boundary of the (single) component
  let start = -1; for (let i=0;i<W*H;i++) if (m[i]) { start = i; break; }
  const dirs = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  const pts = []; let x = start % W, y = (start/W)|0, d = 6; const sx = x, sy = y;
  do { pts.push([x,y]); let found = false;
    for (let k=0;k<8;k++) { const nd = (d+6+k)%8; const nx = x+dirs[nd][0], ny = y+dirs[nd][1]; if (at(m,nx,ny)) { x=nx; y=ny; d=nd; found=true; break; } }
    if (!found) break; } while ((x!==sx||y!==sy) && pts.length < 200000);
  return pts;
}
function rdp(pts, eps) {
  if (pts.length < 3) return pts; const [a, b] = [pts[0], pts[pts.length-1]];
  let idx = 0, dmax = 0; const L = Math.hypot(b[0]-a[0], b[1]-a[1]) || 1;
  for (let i=1;i<pts.length-1;i++) { const d = Math.abs((b[0]-a[0])*(a[1]-pts[i][1]) - (a[0]-pts[i][0])*(b[1]-a[1])) / L; if (d > dmax) { dmax = d; idx = i; } }
  return dmax > eps ? [...rdp(pts.slice(0, idx+1), eps).slice(0,-1), ...rdp(pts.slice(idx), eps)] : [a, b];
}
const closed = (pts, eps) => { const h = pts.length >> 1; return [...rdp(pts.slice(0, h+1), eps).slice(0,-1), ...rdp(pts.slice(h).concat([pts[0]]), eps).slice(0,-1)]; };

// --- landmarks ---------------------------------------------------------------------------
const PXCM = 30.25;                 // from the fret-dot spacing on a 25.5" (64.77 cm) scale
const isMaple = (c) => c === 1;
// neck centre line and edges: maple extent per column
const edge = (x) => { let t=-1,b=-1; for (let y=0;y<H;y++) if (isMaple(cls[y*W+x])) { if(t<0) t=y; b=y; } return [t,b]; };
// nut: the white strip between fingerboard and headstock; find it by scanning for a column with white across the neck
let nutX = -1; for (let x = 2550; x > 2300; x--) { let w = 0; for (let y=380;y<600;y++) if (cls[y*W+x]===3) w++; if (w > 60) { nutX = x; break; } }
const [nt, nb] = edge(nutX - 12), [ht, hb] = edge(1080);
const cy = (nt + nb) / 2;
const scaleLen = 64.77 * PXCM;
const saddleX = nutX - scaleLen;
let mapleStart = -1; for (let x = 980; x < 1400; x++) { const [t,b] = edge(x); if (t>=0 && b-t > 100) { mapleStart = x; break; } }
const heelEnd = mapleStart + 7.6 * PXCM; // the neck sits 3" into its pocket

// body: everything that isn't background or maple left of the horn tips, plus the pocket under the heel
const bodyM = fill(largest(open(mask((x, y, c) => x < 1520 && c !== 0 && (c !== 1 || x < heelEnd)), 2)));
const erode = (m, r) => { const d = new Uint8Array(W*H); for (let y=0;y<H;y++) for (let x=0;x<W;x++) { let v = 1; for (let dy=-r;dy<=r&&v;dy+=2) for (let dx=-r;dx<=r;dx+=2) if (!at(m,x+dx,y+dy)) { v = 0; break; } d[y*W+x] = v; } return d; };
const inner = erode(bodyM, 22); // the body minus its edge bevel highlights
const guardM = fill(largest(open(fill(close(mask((x, y, c) => x < 1300 && (c === 3 || c === 5) && inner[y*W+x] && !(x < 505 && y > 355 && y < 625)), 4)), 4)));
const headM = fill(largest(open(fill(close(mask((x, y, c) => x > nutX + 4 && c === 1), 6)), 3)));

const toLocal = ([x, y]) => [+( (y - cy) / PXCM ).toFixed(2), +( x / PXCM ).toFixed(2)]; // cm: x across (bass side −), y up the guitar
const outline = (m, eps) => closed(trace(m), eps).map(toLocal);

// cream parts inside the guard: pickups (elongated) and knobs/switch tip (round-ish)
const cream = components(close(mask((x, y, c) => c === 5 && x > 520 && x < 1000 && y > 330 && y < 640), 3)).filter(c => c.n > 1200);
const pca = (c) => { const mx = c.sx/c.n, my = c.sy/c.n; let xx=0,yy=0,xy=0; for (const j of c.px) { const dx = j%W-mx, dy=((j/W)|0)-my; xx+=dx*dx; yy+=dy*dy; xy+=dx*dy; }
  const ang = 0.5*Math.atan2(2*xy, xx-yy); const l1 = (xx+yy)/2 + Math.sqrt(((xx-yy)/2)**2 + xy*xy), l2 = (xx+yy)/2 - Math.sqrt(((xx-yy)/2)**2 + xy*xy);
  return { center: toLocal([mx, my]), angleDeg: +(ang*180/Math.PI).toFixed(1), length: +(4*Math.sqrt(l1/c.n)/PXCM).toFixed(2), width: +(4*Math.sqrt(l2/c.n)/PXCM).toFixed(2), n: c.n }; };
const parts = cream.map(pca).sort((a,b)=>b.n-a.n);
// tuner bushings: non-maple blobs inside the filled headstock
const tuners = components(mask((x, y, c) => headM[y*W+x] && c !== 1 && c !== 0)).filter(c => c.n > 150).map(pca);
// chrome on the body that isn't the guard: bridge and jack plate
const chrome = components(open(mask((x, y, c) => (c === 4 || c === 5) && bodyM[y*W+x] && !guardM[y*W+x]), 1)).filter(c => c.n > 400).map(pca);

// pickguard screws: small bright/chrome dots inside the guard outline
const screws = components(mask((x, y, c) => guardM[y*W+x] && (c === 4 || c === 2) && x > 330 && x < 1300))
  .filter(c => c.n > 25 && c.n < 260 && c.maxx - c.minx < 22 && c.maxy - c.miny < 22).map(c => toLocal([c.sx/c.n, c.sy/c.n]));
const result = { cy, screws,
  pxPerCm: PXCM, nutY: +(nutX / PXCM).toFixed(2), saddleY: +(saddleX / PXCM).toFixed(2), heelY: +(heelEnd / PXCM).toFixed(2),
  mapleStartY: +(mapleStart / PXCM).toFixed(2), neckWidthNut: +((nb - nt) / PXCM).toFixed(2), neckWidthHeel: +((hb - ht) / PXCM).toFixed(2),
  neckCenterOffset: { nut: +(((nt+nb)/2 - cy)/PXCM).toFixed(2), heel: +(((ht+hb)/2 - cy)/PXCM).toFixed(2) },
  body: outline(bodyM, 1.2), guard: outline(guardM, 1.0), headstock: outline(headM, 1.0), parts, tuners, chrome,
};
process.stdout.write(JSON.stringify(result));
