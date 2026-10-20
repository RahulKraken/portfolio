import "./i.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-i" data-lab="i">
      {children}
    </div>
  );
}
