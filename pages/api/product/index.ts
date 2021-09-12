import { StatusCodes } from '@enums/StatusCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import databaseMiddleware from 'server/middlewares/database'
import { Mongoose } from 'mongoose'
import ProductModel from 'server/models/product.model'
import isAuthenticatedMiddleware from '@middlewares/isAuthenticated'

const handler = nc()
  .use(
    databaseMiddleware,
    (req: NextApiRequest, res: NextApiResponse, next) => {
      if (req.method !== 'GET') {
        isAuthenticatedMiddleware(req, res, next)
      } else next() // GET requests for products are not authenticated
    }
  )
  .post(
    async (
      req: NextApiRequest & {
        db: Mongoose // db is coming from the databaseMiddleware,
        user: { _id: any; email: string } // user is coming from the isAuthenticatedMiddleware
      }, 
      res: NextApiResponse
    ) => {
      try {
        const { name, image, description, price } = req.body

        const product = await new ProductModel({
          name,
          image_url: image,
          description,
          price,
          seller: req.user._id,
        }).save()

        res.status(StatusCodes.CREATED).json({
          message: 'Product created successfully',
          product,
        })
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Cannot add a product moment',
        })
      }
    }
  )
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const products = await ProductModel.find().populate({
      path: 'seller',
      select: '-password',
    })
    res.json({ products })
  })
export default handler
