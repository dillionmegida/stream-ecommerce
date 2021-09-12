import ConversationInterface from '@interfaces/conversation.interface'
import mongoose, { Schema } from 'mongoose'

const Conversation = new Schema({
  _id: String,
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  buyer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
  },
  seller_id: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
})

export default mongoose.models.Conversation || // incase the model is already defined
  mongoose.model<ConversationInterface>(
    'Conversation',
    Conversation,
    'conversations'
  )
