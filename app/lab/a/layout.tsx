import "./a.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-a" data-lab="a">
      {children}
    </div>
  );
}
