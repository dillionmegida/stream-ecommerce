import { StatusCodes } from '@enums/StatusCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import middleware from 'server/middlewares/database'
import { Mongoose } from 'mongoose'
import SellerModel from 'server/models/seller.model'
import { hashPassword } from 'server/utils/password'
import { createToken } from 'server/utils/token'

const handler = nc()
  .use(middleware)
  .post(
    async (
      req: NextApiRequest & { db: Mongoose }, // db is coming from the middleware
      res: NextApiResponse
    ) => {
      try {
        const { email, password } = req.body

        const sellerExists = await SellerModel.findOne({
          email,
          password,
        })

        if (sellerExists)
          return res.status(StatusCodes.CONFLICT).json({
            message: 'This email is already in use',
          })

        const hashedPassword = await hashPassword(password)

        const newSeller = new SellerModel({
          email,
          password: hashedPassword,
        })

        await newSeller.save()

        const token = createToken({
          _id: newSeller._id,
          email: newSeller.email,
          type: 'seller',
        })

        res.status(StatusCodes.CREATED).json({
          message: 'Account created successfully',
          token,
        })
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Cannot register at the moment',
        })
      }
    }
  )

export default handler
