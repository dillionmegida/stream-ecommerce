import axios from 'axios'
import { authHeader } from 'src/utils/cookie'

export default function getAuthSeller() {
  return axios({
    method: 'GET',
    url: '/api/seller/me',
    headers: {
      ...authHeader,
    },
  })
}
