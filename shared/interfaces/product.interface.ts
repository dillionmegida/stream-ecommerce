import Seller from './seller.interface'

export default interface ProductInterface {
  _id: string
  name: string
  price: number
  description: string
  image_url: string
  seller: Seller
}
