import "./l.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-l" data-lab="l">
      {children}
    </div>
  );
}
