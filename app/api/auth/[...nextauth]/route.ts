
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error('No admin user found');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials');
        }

        return {
            id: admin.id,
            email: admin.email,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET, // Add your own secret here, e.g. openssl rand -hex 32
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
            (session.user as any).id = token.id;
        }
        return session;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
