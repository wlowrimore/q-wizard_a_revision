import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

export const Options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
        };
      }
      return session;
    },
  },
};
