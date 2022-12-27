import { type inferAsyncReturnType } from "@trpc/server";

import { type Session } from "next-auth";

import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateInnerContextOptions) => {
  return {
    prisma,
    session:opts.session,
    req:opts.req,
    res:opts.res
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateInnerContextOptions) => {
  const { req, res } = opts as {
    req:NextApiRequest,
    res:NextApiResponse
  };

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session,
    req:opts.req,
    res:opts.res
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
