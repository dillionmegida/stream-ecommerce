import BuyerInterface from '@interfaces/buyer.interface'
import mongoose, { Schema } from 'mongoose'

const Buyer = new Schema({
  email: String,
  password: String,
})

export default mongoose.models.Buyer || // incase the model is already defined
  mongoose.model<BuyerInterface>('Buyer', Buyer, 'buyers')
