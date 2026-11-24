import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary } from "@/lib/dictionary";
import { locales, site, type Locale } from "@/lib/site";
import Providers from "@/components/Providers";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s — ${site.shortName}` },
    description: t.meta.description,
    alternates: { languages: { id: "/id", en: "/en" } },
    openGraph: { title: t.meta.title, description: t.meta.description, images: ["/images/portrait-caesar.jpg"], locale },
    authors: [{ name: site.name }],
  };
}

export const viewport: Viewport = { themeColor: "#D7261E" };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale as Locale}>{children}</Providers>
      </body>
    </html>
  );
}
