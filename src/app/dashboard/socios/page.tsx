import Link from "next/link";

export default function SociosPage() {
  return (
    <div className="relative h-full">
      <h1 className="text-2xl font-bold mb-4">Listado de Socios</h1>

      <Link 
        href="/dashboard/socios/nuevo" 
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl shadow-lg hover:opacity-90"
        aria-label="+"
      >
        +
      </Link>
    </div>
  );
}
