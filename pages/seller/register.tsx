import { useState } from 'react'
import Layout from 'src/components/organisms/layout'
import axios from 'axios'
import AuthForm from '@molecules/auth-form'
import { toast } from 'react-toastify'
import links from '@constants/links'
import Link from 'next/link'

export default function SellerRegister() {
  const [processing, setProcessing] = useState(false)

  const onSubmit = async (values) => {
    const { email, password } = values

    setProcessing(true)

    try {
      await axios({
        method: 'post',
        url: '/api/seller/register',
        data: {
          email,
          password,
        },
      })

      window.location.href = '/seller/dashboard'
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
          altLink={links.SELLER.LOGIN}
          heading="Register as a Seller"
          submitText="Register"
          onSubmit={onSubmit}
          processing={processing}
          belowFormContent={
            <div className="text-center underline">
              <Link href={links.BUYER.REGISTER}>
                <a>Register as a Buyer</a>
              </Link>
            </div>
          }
        />
      </div>
    </Layout>
  )
}
