import { StatusCodes } from '@enums/StatusCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import middleware from 'server/middlewares/database'
import { Mongoose } from 'mongoose'
import ProductModel from 'server/models/product.model'
import sellerModel from 'server/models/seller.model'

const handler = nc()
  .use(middleware)
  .get(
    async (
      req: NextApiRequest & { db: Mongoose }, // db is coming from the middleware
      res: NextApiResponse
    ) => {
      try {
        const { id } = req.query

        // in the definition, the product model has a reference to the seller model
        // but since the seller has not been used yet (for it to be availalbe),
        // this next line is a trivial and safe way to get the seller model active
        // for .populate to work
        sellerModel.db

        const product = await ProductModel.findById(id).populate({
          path: 'seller',
          select: '-password',
        })

        if (!product)
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Product not found' })

        res.status(StatusCodes.CREATED).json({
          message: 'Product fetched successfully',
          product,
        })
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Cannot fetch this product',
        })
      }
    }
  )

export default handler
