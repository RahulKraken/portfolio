type AtmosphereProps = {
  src: string;
  alt: string;
};

export function Atmosphere({ src, alt }: AtmosphereProps) {
  return (
    <>
      <div className="world-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      <div className="world-wash" aria-hidden />
    </>
  );
}
