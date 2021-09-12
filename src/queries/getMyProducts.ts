import axios from 'axios'
import { authHeader } from 'src/utils/cookie'

export default function getMyProducts() {
  return axios({
    method: 'GET',
    url: '/api/seller/my-product',
    headers: {
      ...authHeader,
    },
  })
}
