import { StatusCodes } from '@enums/StatusCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { Mongoose } from 'mongoose'
import databaseMiddleware from 'server/middlewares/database'
import isAuthenticated from '@middlewares/isAuthenticated'
import conversationModel from 'server/models/conversation.model'

const handler = nc()
  .use(databaseMiddleware, isAuthenticated)
  .get(
    async (
      req: NextApiRequest & {
        db: Mongoose // db is coming from the databaseMiddleware
        user: { _id: string } // user is coming from the isAuthenticated middleware
      },
      res: NextApiResponse
    ) => {
      const { product_id } = req.query

      try {
        const conversations = await conversationModel.find({
          product_id: product_id as string,
          seller_id: req.user._id,
        })

        if (!conversations.length)
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'There are no conversations for this product' })

        res.json({
          convos: conversations,
        })
      } catch (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to fetch conversations at the moment' })
      }
    }
  )

export default handler
