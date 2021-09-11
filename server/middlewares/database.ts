import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

async function databaseMiddleware(req, res, next) {
  await mongoose.connect(uri)
  return next()
}

export default databaseMiddleware
