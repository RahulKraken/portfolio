import "./f.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-f" data-lab="f">
      {children}
    </div>
  );
}
