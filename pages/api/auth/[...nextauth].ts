import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import Providers from "next-auth/providers";
import errorHandler from "./error";
import session from "./session";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//NEXT_PUBLIC_GOOGLEID="319266702666-5a17t13bm0ms9nigtr09dspre77lfh3p.apps.googleusercontent.com"
//NEXT_PUBLIC_GOOGLE_SECRET="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"
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@me.net" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const options = {
          method: "POST",
          json: true, // if truthy, parse *response* as JSON
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        };
        const response = await fetch(
          "https://rexlogin.herokuapp.com/signin",
          options
        );
        if (response.status === 401) {
          // Handle unauthorized access
          throw new Error("Invalid email or password");
        }
        if (response.status === 404) {
          // Handle unauthorized access
          throw new Error("You dont have an account with that email");
        }
        if (response.status === 500) {
          // Handle unauthorized access
          throw new Error("Problem during sign in try again later");
        }
        const data = await response.json();
        if (data) {
          console.log(data);
          const { email, username } = data;
          return { email, name: username, id: email };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId:
        "319266702666-5a17t13bm0ms9nigtr09dspre77lfh3p.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  secret: "any",
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin";
      return token;
    },

    async redirect(params: { url: any; baseUrl: any }) {
      return params.url.startsWith(params.baseUrl)
        ? params.url
        : `${params.baseUrl}/Marketplace/MarketPage`;
    },
  },
};

export default NextAuth(authOptions);
