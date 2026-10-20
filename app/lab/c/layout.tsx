import "./c.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-c" data-lab="c">
      {children}
    </div>
  );
}
