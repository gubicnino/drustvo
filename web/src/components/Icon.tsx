import {
  ArrowRight,
  Compass,
  Heart,
  Leaf,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Mountain,
  Users,
  Ruler,
  TrendingUp,
  Menu,
  X,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  SquarePen,
  ExternalLink,
  Building2,
  Check,
  Star,
  type LucideIcon,
} from "lucide-react";

// Preslikava internih imen → lucide-react komponente.
const MAP: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  compass: Compass,
  heart: Heart,
  leaf: Leaf,
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  calendar: CalendarDays,
  mountain: Mountain,
  users: Users,
  ruler: Ruler,
  "trending-up": TrendingUp,
  menu: Menu,
  x: X,
  image: ImageIcon,
  dashboard: LayoutDashboard,
  "log-out": LogOut,
  plus: Plus,
  trash: Trash2,
  pencil: SquarePen,
  external: ExternalLink,
  building: Building2,
  check: Check,
  star: Star,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  // Facebook (in druge blagovne ikone) lucide ne vključuje – ohranimo svojo.
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return <Cmp className={className} aria-hidden="true" />;
}
