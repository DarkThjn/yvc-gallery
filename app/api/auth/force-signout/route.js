import { NextResponse } from "next/server";

export async function GET(request) {
  const loginUrl = new URL("/admin/login", request.url);
  if (request.nextUrl.searchParams.get("reason") === "session-replaced") {
    loginUrl.searchParams.set("reason", "session-replaced");
  }

  const response = NextResponse.redirect(loginUrl);
  const sessionCookiePrefixes = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token"
  ];

  for (const cookie of request.cookies.getAll()) {
    const isSessionCookie = sessionCookiePrefixes.some(
      (prefix) => cookie.name === prefix || cookie.name.startsWith(`${prefix}.`)
    );
    if (isSessionCookie) response.cookies.delete(cookie.name);
  }

  for (const prefix of sessionCookiePrefixes) {
    response.cookies.delete(prefix);
  }
  return response;
}
