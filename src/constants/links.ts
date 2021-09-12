const links = {
  SELLER: {
    LOGIN: '/seller/login',
    REGISTER: '/seller/register',
    PRODUCTS: '/seller/products',
    PRODUCT_DETAIL: (id: string) => `/seller/products/${id}`,
  },
  BUYER: { LOGIN: '/buyer/login', REGISTER: '/buyer/register' },
}

export default links
