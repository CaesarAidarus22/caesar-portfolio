import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p>404 / NOT FOUND</p>
      <h1>Rute ini berada di luar peta.</h1>
      <span>Halaman mungkin telah dipindahkan, atau slug project tidak tersedia.</span>
      <Link href="/"><ArrowLeft size={17} /> Return home</Link>
    </main>
  );
}
