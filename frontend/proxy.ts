import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/collections", "/category", "/showroom", "/auth", "/test-auth"].some(path => 
    nextUrl.pathname === path || nextUrl.pathname.startsWith(path + "/")
  );
  const isAuthRoute = nextUrl.pathname === "/auth";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) {
    return;
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth", nextUrl));
    }
    
    const role = (req.auth?.user as any)?.role;
    const adminRoles = ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"];
    
    console.log("--- MIDDLEWARE DEBUG ---");
    console.log("Path:", nextUrl.pathname);
    console.log("User Role:", role);

    if (!adminRoles.includes(role)) {
      console.log("Access DENIED: Not an admin role");
      return Response.redirect(new URL("/", nextUrl));
    }
    console.log("Access GRANTED: Admin role detected");
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
