import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 max-w-4xl">
      <div className="space-y-6">
        <p className="text-primary font-bold text-xs tracking-wider uppercase">
          Brgy. San Isidro, Quezon City
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
          Request your barangay documents — anytime, anywhere.
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl">
          Hindi na kailangan pang pumila.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Button size="lg" className="rounded-md" asChild>
            <Link to="/verify" state={{ next: '/request' }}>Mag-request ng dokumento</Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-md" asChild>
            <Link to="/track">I-track ang aking request</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
