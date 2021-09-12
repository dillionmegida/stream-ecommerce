import { useState } from 'react'
import Layout from 'src/components/organisms/layout'
import axios from 'axios'
import AuthForm from '@molecules/auth-form'
import { toast } from 'react-toastify'
import links from '@constants/links'
import Link from 'next/link'
import { setCookie } from 'src/utils/cookie'

export default function BuyerRegister() {
  const [processing, setProcessing] = useState(false)

  const onSubmit = async (values) => {
    const { email, password } = values

    setProcessing(true)

    try {
      const {
        data: { token },
      } = await axios({
        method: 'post',
        url: '/api/buyer/register',
        data: {
          email,
          password,
        },
      })

      setCookie('AUTH', token)

      toast.success('Account created successful')

      window.location.href = '/buyer/dashboard'
    } catch (err) {
      setProcessing(false)
      toast.error(err.response.data.message)
    }
  }

  return (
    <Layout>
      <div className="container">
        <AuthForm
          type="register"
          altLink={links.BUYER.LOGIN}
          heading="Register as a Buyer"
          submitText="Register"
          onSubmit={onSubmit}
          processing={processing}
          belowFormContent={
            <div className="text-center underline">
              <Link href={links.SELLER.REGISTER}>
                <a>Register as a Seller</a>
              </Link>
            </div>
          }
        />
      </div>
    </Layout>
  )
}
