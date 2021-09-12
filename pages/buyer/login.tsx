import { useEffect, useState } from 'react'
import Layout from 'src/components/organisms/layout'
import axios from 'axios'
import AuthForm from '@molecules/auth-form'
import { toast } from 'react-toastify'
import links from '@constants/links'
import Link from 'next/link'
import { setCookie } from 'src/utils/cookie'
import getAuthBuyer from 'src/queries/getAuthBuyer'

export default function BuyerLogin() {
  const [processing, setProcessing] = useState(false)

  const onSubmit = async (values) => {
    const { email, password } = values

    setProcessing(true)

    try {
      const res = await axios({
        method: 'post',
        url: '/api/buyer/login',
        data: {
          email,
          password,
        },
      })

      setCookie('AUTH', res.data.token)

      window.location.href = '/buyer/dashboard'
    } catch (err) {
      setProcessing(false)
      toast.error(err.response.data.message)
    }
  }

  useEffect(() => {
    getAuthBuyer()
      .then(() => (window.location.href = '/buyer/dashboard'))
      .catch(() => {})
  }, [])

  return (
    <Layout>
      <div className="container">
        <AuthForm
          type="login"
          altLink={links.BUYER.REGISTER}
          heading="Login as a Buyer"
          submitText="Login"
          onSubmit={onSubmit}
          processing={processing}
          belowFormContent={
            <div className="text-center underline">
              <Link href={links.SELLER.LOGIN}>
                <a>Login as a Seller</a>
              </Link>
            </div>
          }
        />
      </div>
    </Layout>
  )
}
