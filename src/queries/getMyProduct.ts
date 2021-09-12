import axios from 'axios'
import { authHeader } from 'src/utils/cookie'

export default function getMyProduct(id: string) {
  return axios({
    method: 'GET',
    url: `/api/seller/my-product/${id}`,
    headers: {
      ...authHeader,
    },
  })
}
