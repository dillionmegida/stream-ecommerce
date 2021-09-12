import { StatusCodes } from '@enums/StatusCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { Mongoose } from 'mongoose'
import databaseMiddleware from 'server/middlewares/database'
import isAuthenticated from '@middlewares/isAuthenticated'
import conversationModel from 'server/models/conversation.model'
import { nanoid } from 'nanoid'

const handler = nc()
  .use(databaseMiddleware, isAuthenticated)
  .post(
    async (
      req: NextApiRequest & {
        db: Mongoose // db is coming from the databaseMiddleware

        user: { _id: string } // user is coming from the isAuthenticated middleware,
      },
      res: NextApiResponse
    ) => {
      const { product_id, seller_id } = req.body

      try {
        const existingConversation = await conversationModel.findOne({
          product_id,
          seller_id,
          buyer_id: req.user._id,
        })

        const channelId = existingConversation?._id || nanoid()

        if (!existingConversation) {
          await conversationModel.create({
            _id: channelId,
            product_id,
            seller_id,
            buyer_id: req.user._id,
          })
        }

        res.json({
          convo: {
            channelId,
          },
        })
      } catch (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to start a conversation at the moment' })
      }
    }
  )

export default handler
