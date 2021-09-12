import axios from 'axios'
import { authHeader } from 'src/utils/cookie'

type Args = {
  product_id: string
}
export default function getConversations({ product_id }: Args) {
  return axios({
    method: 'GET',
    url: `/api/conversation/${product_id}`,
    headers: {
      ...authHeader,
    },
    data: {
      product_id,
    },
  })
}
