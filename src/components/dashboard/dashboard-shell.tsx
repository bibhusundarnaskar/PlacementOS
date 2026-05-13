import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { FileText, LayoutDashboard, ListChecks, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/resumes", label: "Resumes", icon: FileText },
  { href: "/dashboard/interviews", label: "Interviews", icon: MessageSquare },
  { href: "/dashboard/progress", label: "Progress", icon: ListChecks },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card px-4 py-5 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            P
          </span>
          PlacementOS
        </Link>
        <nav className="grid gap-1">
          {nav.map((item) => (
            <Button key={item.href} variant="ghost" className="justify-start" asChild>
              <Link href={item.href}>
                <item.icon className="size-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              P
            </span>
            <span className="text-sm font-semibold">PlacementOS</span>
          </div>
          <div className="hidden text-sm text-muted-foreground lg:block">
            AI career workspace
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
