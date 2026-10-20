import "./d.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-d" data-lab="d">
      {children}
    </div>
  );
}
