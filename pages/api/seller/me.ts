import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import databaseMiddleware from 'server/middlewares/database'
import { Mongoose } from 'mongoose'
import isAuthenticatedMiddleware from '@middlewares/isAuthenticated'
import { StatusCodes } from '@enums/StatusCodes'

const handler = nc()
  .use(databaseMiddleware, isAuthenticatedMiddleware)
  .get(
    async (
      req: NextApiRequest & {
        db: Mongoose // coming from the databaseMiddleware
        user: { _id: any; email: string }
      },
      res: NextApiResponse
    ) => {
      // req.user is coming from the isAuthenticatedMiddleware
      // @ts-ignore
      // .type is added in the token from the login handlers
      if (req.user.type !== 'seller')
        return res
          .status(StatusCodes.UNATHORIZED)
          .json({ error: 'Unauthorized' })

      return res.json(req.user)
    }
  )

export default handler
