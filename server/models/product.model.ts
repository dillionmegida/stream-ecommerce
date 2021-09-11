import ProductInterface from '@interfaces/product.interface'
import mongoose, { Schema } from 'mongoose'

const Product = new Schema({
  name: String,
  image_url: String,
  price: Number,
  description: String,
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
})

export default mongoose.models.Product || // incase the model is already defined
  mongoose.model<ProductInterface>('Product', Product, 'products')
