import "./g.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-g" data-lab="g">
      {children}
    </div>
  );
}
