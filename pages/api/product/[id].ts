import { StatusCodes } from '@enums/StatusCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import middleware from 'server/middlewares/database'
import { Mongoose } from 'mongoose'
import ProductModel from 'server/models/product.model'

const handler = nc()
  .use(middleware)
  .get(
    async (
      req: NextApiRequest & { db: Mongoose }, // db is coming from the middleware
      res: NextApiResponse
    ) => {
      try {
        const { id } = req.query

        const product = await ProductModel.findById(id)

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
