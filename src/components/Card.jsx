export default function Card({ children, className = "" }) {
  return (
    <div className={`border rounded shadow-sm p-4 bg-white ${className}`}>
      {children}
    </div>
  );
}
