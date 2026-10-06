"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Heart, LogOut, Package, User } from "lucide-react";
import { useT } from "@/hooks/use-i18n";
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

function initials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email || "?";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu() {
  const t = useT();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.account}>
          {user ? (
            <Avatar className="size-7">
              {user.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {initials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="size-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuLabel className="space-y-0.5">
              <p className="truncate font-semibold">{user.name ?? t.account}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/orders">
                <Package />
                {t.orders}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/wishlist">
                <Heart />
                {t.wishlist}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
              <LogOut />
              {t.logout}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>{t.account}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">{t.login}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">{t.signUpNow}</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}