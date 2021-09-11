import SellerInterface from '@interfaces/seller.interface'
import mongoose, { Schema } from 'mongoose'

const Seller = new Schema({
  email: String,
  password: String,
})

export default mongoose.models.Seller || // incase the model is already defined
  mongoose.model<SellerInterface>('Seller', Seller, 'sellers')
