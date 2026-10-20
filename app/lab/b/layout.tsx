import "./b.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-b" data-lab="b">
      {children}
    </div>
  );
}
