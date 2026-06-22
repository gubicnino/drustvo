import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Mountain } from "@/components/icons";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pine-50 text-pine">
        <Mountain className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-serif text-4xl font-semibold text-pine-dark">Stran ne obstaja</h1>
      <p className="mt-3 max-w-md text-muted">
        Zdi se, da si zašel s poti. Vrni se na začetek ali si oglej naše pohode.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary">
          Nazaj domov
        </Button>
        <Button href="/pohodi" variant="outline">
          Poglej pohode
        </Button>
      </div>
    </Container>
  );
}
