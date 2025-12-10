export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*", "/products/:path*"],
};

