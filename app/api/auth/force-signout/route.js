import { NextResponse } from "next/server";

export async function GET(request) {
  const loginUrl = new URL("/admin/login", request.url);
  if (request.nextUrl.searchParams.get("reason") === "session-replaced") {
    loginUrl.searchParams.set("reason", "session-replaced");
  }

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  return response;
}
