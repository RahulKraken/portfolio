import "./k.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-k" data-lab="k">
      {children}
    </div>
  );
}
