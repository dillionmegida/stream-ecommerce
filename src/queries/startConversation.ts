import axios from 'axios'
import { authHeader } from 'src/utils/cookie'

type Args = {
  product_id: string
  seller_id: string
}

export default function startConversation({ product_id, seller_id }: Args) {
  return axios({
    method: 'POST',
    url: '/api/conversation',
    headers: {
      ...authHeader,
    },
    data: {
      product_id,
      seller_id,
    },
  })
}
