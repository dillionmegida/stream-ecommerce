import axios from 'axios'
import { authHeader } from 'src/utils/cookie'

export default function getAuthBuyer() {
  return axios({
    method: 'GET',
    url: '/api/buyer/me',
    headers: {
      ...authHeader,
    },
  })
}
