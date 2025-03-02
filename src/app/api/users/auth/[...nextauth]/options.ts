
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        gender?: string;
      };
    }
  
    interface User {
      id: string;
      email: string;
      name: string;
      role: string;
      gender?: string;
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      email: string;
      name: string;
      role: string;
      gender?: string;
    }
  }

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials) {
                        throw new Error('Missing credentials')
                    }
                    if (!credentials.email || !credentials.password) {
                        throw new Error('Missing credentials')
                    }
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })
                    if (!user) {
                        throw new Error('No user found')
                    }
                    if (!user.isVerified) {
                        throw new Error('User not verified')
                    }
                    const ispasswordcorrect = await bcrypt.compare(credentials.password, user.password)
                    if (!ispasswordcorrect) {
                        throw new Error('Password is incorrect')
                    }
                    return user
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    } else {
                        throw new Error("An unknown error occurred");
                    }
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { isVerified: true },
                });
            }
            return true
        },
        async session({ session, token }) {
            if(token) {
                session.user.email = token.email
                session.user.name = token.name
                session.user.id = token.id
                session.user.role = token.role
                session.user.gender=token.gender
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token.id=user.id
                token.email=user.email
                token.name=user.name
                token.role=user.role
                token.gender=user.gender
            }
            return token
        }
    },
    pages:{
        signIn: '/sign-in',
    },
    session:{
        strategy: 'jwt',
    },
    secret: process.env.SECRET_KEY,
}