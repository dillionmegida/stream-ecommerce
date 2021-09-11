import { useEffect, useState } from 'react'
import Layout from 'src/components/organisms/layout'
import axios from 'axios'
import AuthForm from '@molecules/auth-form'
import { toast } from 'react-toastify'
import Link from 'next/link'
import links from '@constants/links'
import { authHeader, setCookie } from 'src/utils/cookie'

export default function SellerLogin() {
  const [processing, setProcessing] = useState(false)

  const onSubmit = async (values) => {
    const { email, password } = values

    setProcessing(true)

    try {
      const res = await axios({
        method: 'post',
        url: '/api/seller/login',
        data: {
          email,
          password,
        },
      })

      setCookie('AUTH', res.data.token)

      window.location.href = '/seller/dashboard'
    } catch (err) {
      setProcessing(false)
      toast.error(err.response.data.message)
    }
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/api/seller/me',
      headers: {
        ...authHeader,
      },
    })
      .then(() => (window.location.href = '/seller/dashboard'))
      .catch(() => {})
  }, [])

  return (
    <Layout>
      <div className="container">
        <AuthForm
          type="login"
          altLink={links.SELLER.REGISTER}
          heading="Login as a Seller"
          submitText="Login"
          onSubmit={onSubmit}
          processing={processing}
          belowFormContent={
            <div className="text-center underline">
              <Link href={links.BUYER.LOGIN}>
                <a>Login as a Buyer</a>
              </Link>
            </div>
          }
        />
      </div>
    </Layout>
  )
}
