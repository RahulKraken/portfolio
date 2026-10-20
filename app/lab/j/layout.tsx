import "./j.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-j" data-lab="j">
      {children}
    </div>
  );
}
