import "./m.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-m" data-lab="m">
      {children}
    </div>
  );
}
