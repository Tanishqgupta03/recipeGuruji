import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        console.log("Database connected. Checking credentials...");

        try {
          // Check if the user exists by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            console.log("No user found with the provided email or username.");
            throw new Error("No account found with the provided email or username.");
          }

          // Check if the account is verified
          if (!user.isVerified) {
            console.log("User account is not verified.");
            throw new Error("Your account is not verified. Please verify it before logging in.");
          }

          // Validate the password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            console.log("Incorrect password.");
            throw new Error("Incorrect password. Please try again.");
          }

          console.log("User authenticated successfully:", user);
          return user;
        } catch (err) {
          console.error("Error during authorization:", err.message);
          throw new Error(err.message || "Something went wrong. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback - Token:", token);
      console.log("Session callback - Session before update:", session);

      session.user.id = token.id; // Include user ID in session
      session.user.username = token.username; // Include username in session

      console.log("Session callback - Session after update:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback - Token before update:", token);
      console.log("JWT callback - User:", user);

      if (user) {
        token.id = user.id; // Add user ID to token
        token.username = user.username; // Add username to token
      }

      console.log("JWT callback - Token after update:", token);
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);



/*callbacks
Callbacks allow customization of session and token behavior.

session({ session, token }):

Adds the user's ID (token.id) to the session object.
The session object is accessible in both the frontend and backend.
jwt({ token, user }):

When a user successfully logs in, their ID is stored in the token (token.id).
Tokens are used in JWT-based authentication for maintaining stateless sessions.
pages
Defines custom routes for authentication pages.

signIn: Redirects users to /sign-in when they need to log in.
session
Configures how sessions are maintained:

strategy: "jwt": Sessions are managed using JSON Web Tokens (JWTs), enabling a stateless approach.
secret
A secret key used for signing tokens. This value is stored securely in the environment variables (NEXTAUTH_SECRET).

3. Export Default
The authOptions object is passed to the NextAuth function to set up authentication. This object configures the NextAuth middleware, which handles the authentication flow in the application.

Behavior Overview
A user logs in using their email/username and password.
The credentials are validated:
Database lookup for the user.
Password verification using bcrypt.compare.
Account verification status is checked.
If successful, the user is authenticated:
A session is created with the user's ID.
JWT tokens are issued for maintaining the session.
The app uses these tokens and sessions for authentication-protected routes.
This setup allows secure credential-based authentication with customizable session handling and support for JWT-based sessions. */
