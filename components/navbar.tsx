"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  LayoutGrid,
  LogOut,
  Menu,
  PlusCircle,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clearTokenCache } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { fallbackAvatar, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
];

const accountLinks = [
  { href: "/create-event", label: "Create Event", icon: PlusCircle },
  { href: "/manage-events", label: "Manage Events", icon: LayoutGrid },
  { href: "/joined-events", label: "Joined Events", icon: UsersRound },
  { href: "/profile", label: "My Profile", icon: UserRound },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "Sahajjo member";
  const avatarSrc = user?.image || fallbackAvatar(displayName);

  async function handleLogout() {
    setLoggingOut(true);
    clearTokenCache();
    try {
      await signOut();
      clearTokenCache();
      toast.success("You are logged out. See you at the next event!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("We could not log you out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/88 shadow-[0_10px_30px_-24px_rgba(20,40,30,0.45)] backdrop-blur-xl"
          : "border-b border-transparent bg-background/60 backdrop-blur-md",
      )}
    >
      <div className="site-container flex h-[4.6rem] items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "underline-sweep relative text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <ThemeToggle />

          {isPending ? (
            <div className="flex items-center gap-2">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="hidden h-8 w-16 rounded-full md:block" />
            </div>
          ) : user ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/profile"
                    aria-label={`${displayName} — open profile`}
                    className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Avatar className="size-9 border border-border/80 shadow-sm">
                      <AvatarImage src={avatarSrc} alt={displayName} />
                      <AvatarFallback className="bg-brand-soft text-xs font-semibold text-primary">
                        {initials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span className="font-medium">{displayName}</span>
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden gap-1.5 text-muted-foreground md:inline-flex"
                    aria-label="Open account menu"
                  >
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {displayName}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountLinks.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        <item.icon />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={loggingOut}
                    onSelect={() => void handleLogout()}
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleLogout()}
                disabled={loggingOut}
                className="hidden border-border/80 bg-background/60 md:inline-flex"
              >
                <LogOut />
                {loggingOut ? "Logging out..." : "Log out"}
              </Button>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="px-4">
                <Link href="/register">Join Sahajjo</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[19rem] p-0">
              <SheetHeader className="border-b border-border/70 px-5 py-4 text-left">
                <SheetTitle className="sr-only">Sahajjo menu</SheetTitle>
                <Logo />
              </SheetHeader>

              <div className="flex h-[calc(100%-4.75rem)] flex-col overflow-y-auto px-4 py-5">
                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive(link.href)
                            ? "bg-brand-soft text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <CalendarDays className="size-4" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {user && (
                  <>
                    <div className="my-4 h-px bg-border/70" />
                    <p className="px-3 pb-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      My account
                    </p>
                    <nav className="flex flex-col gap-1" aria-label="Account navigation">
                      {accountLinks.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <item.icon className="size-4" />
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </>
                )}

                <div className="mt-auto border-t border-border/70 pt-5">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-muted/70 p-3">
                        <Avatar className="size-10 border border-border">
                          <AvatarImage src={avatarSrc} alt={displayName} />
                          <AvatarFallback className="bg-brand-soft text-xs font-semibold text-primary">
                            {initials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{displayName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => void handleLogout()}
                        disabled={loggingOut}
                      >
                        <LogOut />
                        {loggingOut ? "Logging out..." : "Log out"}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/login">Log in</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                          <Link href="/register">Join Sahajjo</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
