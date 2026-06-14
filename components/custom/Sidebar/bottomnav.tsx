// BottomNav.tsx
"use client";
import { NavLinks } from "@/lib/constants/navItems";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const bottomNavLinks: string[] = ["Home", "Expenses", "Incomes"];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden
                    border-t bg-background h-16"
    >
      {NavLinks.filter((nav) => bottomNavLinks.includes(nav.title)).map(
        ({ title, url, icon: Icon }) => {
          const active = pathname === url;
          return (
            <Link
              key={url}
              href={url}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors",
                active
                  ? "text-primary bg-blue-500/10 hover:bg-blue-500/20"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span>{title}</span>
            </Link>
          );
        },
      )}
    </nav>
  );
}
