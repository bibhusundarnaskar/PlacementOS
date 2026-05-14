
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Sidebar } from "@/components/dashboard/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
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
