import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "DummyJSON",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            // Log the error for debugging
            console.error("DummyJSON auth error:", data);
            return null;
          }

          // DummyJSON returns accessToken (not token)
          const token = data.accessToken || data.token;
          if (!token) {
            console.error("No token in response:", data);
            return null;
          }

          return {
            id: data.id?.toString() || data.id,
            name: `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.username,
            email: data.email || "",
            token: token,
            image: data.image || null,
            role: data.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.apiToken = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.token = token.apiToken;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

