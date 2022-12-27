import nextSession from "next-session";

import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { nanoid } from 'nanoid';
import { promisifyStore } from "next-session/lib/compat";
// expressSession({
//     cookie: {
//      maxAge: 7 * 24 * 60 * 60 * 1000 // ms
//     },
//     secret: 'a santa at nasa',
//     resave: true,
//     saveUninitialized: true,
//     store: new PrismaSessionStore(
//       new PrismaClient(),
//       {
//         checkPeriod: 2 * 60 * 1000,  //ms
//         dbRecordIdIsSessionId: true,
//         dbRecordIdFunction: undefined,
//       }
//     )
//   })
const prisma = new PrismaClient();
export const getSession = nextSession({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 60 // ms
    },
    genid: () => { return nanoid() },
    store: promisifyStore(
        new PrismaSessionStore(
            prisma,
            {
                checkPeriod:  2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
                sessionModelName:"sessionCart",
            }
        ),
    )
});