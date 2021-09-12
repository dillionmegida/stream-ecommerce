import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import databaseMiddleware from 'server/middlewares/database'
import ProductModel from 'server/models/product.model'
import isAuthenticatedMiddleware from '@middlewares/isAuthenticated'
import { StatusCodes } from '@enums/StatusCodes'

const handler = nc()
  .use(databaseMiddleware, isAuthenticatedMiddleware)
  .get(
    async (
      req: NextApiRequest & {
        user: { _id: string } // user is coming from isAuthenticatedMiddleware
      },
      res: NextApiResponse
    ) => {
      try {
        const products = await ProductModel.find({
          // @ts-ignore
          seller: req.user._id,
        }).populate({
          path: 'seller',
          select: '-password',
        })
        res.json({ products })
      } catch (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Cannot fetch seller's products" })
      }
    }
  )
export default handler
