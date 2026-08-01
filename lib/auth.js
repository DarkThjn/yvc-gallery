import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";

export const authOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Đăng nhập quản trị",
      credentials: {
        email: { label: "Tên đăng nhập hoặc email", type: "text" },
        password: { label: "Mật khẩu", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email.toLowerCase().trim() }
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        const sessionId = randomUUID();
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { activeSessionId: sessionId }
        });

        return { id: user.id, email: user.email, name: user.name, sessionId };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sessionId = user.sessionId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.sessionId = token.sessionId;
      }

      if (!token.id || !token.sessionId) {
        session.error = "SessionReplaced";
        return session;
      }

      const user = await prisma.adminUser.findUnique({
        where: { id: token.id },
        select: { activeSessionId: true }
      });

      if (!user || user.activeSessionId !== token.sessionId) {
        session.error = "SessionReplaced";
      }
      return session;
    }
  },
  events: {
    async signOut({ token }) {
      if (!token?.id || !token?.sessionId) return;

      await prisma.adminUser.updateMany({
        where: { id: token.id, activeSessionId: token.sessionId },
        data: { activeSessionId: null }
      });
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
