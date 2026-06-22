import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#vsebina"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-pine focus:px-4 focus:py-2 focus:text-white"
      >
        Preskoči na vsebino
      </a>
      <Header />
      <main id="vsebina" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
