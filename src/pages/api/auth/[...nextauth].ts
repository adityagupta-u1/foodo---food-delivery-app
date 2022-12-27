import bcrypt from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  session:{
    strategy:"jwt",
    maxAge:24*60*60
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      type:"credentials",
      credentials:{},
      async authorize(credentials){

        const {name,email,password,method} = credentials as {
          name:string
          email:string
          password:string 
          method:string
        };
        // Check if user with the email exists
        const user = await prisma.user.findFirst({
          where:{ 
            email : email
          },
        })

        // If the user doesn't exist
        if(!user){
          //if the method is register
            if(method === "register"){
              //create a user
              const salt = bcrypt.genSaltSync(12);
              const hash = bcrypt.hashSync(password, salt);
      
              const newUser = await prisma.user.create({
                data:{
                  name:name,
                  email:email,
                  password:hash
                }
              })
              

              console.log(newUser)
              return newUser
          } else {
            throw new Error("invalid user id and password")
          }
        } 
        // if user is registered just return it
        if(user.password === null){
          throw new Error("Please Log in with other social providers")
        }
        const match =  bcrypt.compareSync(password,user.password);
        if(!match){
          throw new Error("Password not matched");
        }
        return user
      }
    })
  ],
  pages:{
    signIn:'auth/login'
  },
  secret:env.JWT_SECRET,
  callbacks:{
    async jwt({ token, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  debug:true
};

export default NextAuth(authOptions);
