import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="display text-[clamp(6rem,25vw,20rem)] italic text-brand">404</span>
      <p className="text-lg">Halaman tidak ditemukan · Page not found</p>
      <Link href="/" className="rounded-full bg-ink px-6 py-3 text-white">← Beranda / Home</Link>
    </main>
  );
}
