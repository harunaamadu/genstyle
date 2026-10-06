import type { NextAuthConfig } from "next-auth";

const protectedPrefixes = ["/orders"];
const authPages = ["/login", "/register"];

export const authConfig = {
  pages: { signIn: "/login" },
  providers: [], // real providers are added in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isProtected = protectedPrefixes.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      );

      if (isProtected) return loggedIn; // false -> redirected to /login?callbackUrl=...
      if (authPages.includes(pathname) && loggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;