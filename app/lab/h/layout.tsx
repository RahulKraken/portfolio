import "./h.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-h" data-lab="h">
      {children}
    </div>
  );
}
