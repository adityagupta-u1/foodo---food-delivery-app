import { type inferAsyncReturnType } from "@trpc/server";

import { type Session } from "next-auth";

import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  req:NextApiRequest,
  res:NextApiResponse<any>
}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts?: CreateInnerContextOptions) => {
  const {req,res} = opts as {
    req:NextApiRequest,
    res:NextApiResponse<any>
  }
  const session = await getServerAuthSession({ req,res });
  return {
    prisma,
    session,
    req:opts?.req,
    res:opts?.res
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateInnerContextOptions) => {
  const { req, res } = opts as {
    req:NextApiRequest,
    res:NextApiResponse<any>
  };

  // Get the session from the server using the unstable_getServerSession wrapper function
  const contextInner = await createContextInner({ req,res });
  return {
    ...contextInner
  }
};

export type Context = inferAsyncReturnType<typeof createContext>;
