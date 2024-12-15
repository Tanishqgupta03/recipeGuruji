import NextAuth from "next-auth";
import { authOptions } from "./option";

const handler = NextAuth(authOptions)//ye handler hi hona chaie 


export {handler as GET, handler as POST}