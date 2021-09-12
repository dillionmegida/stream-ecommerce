import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { authHeader, removeCookie } from 'src/utils/cookie'
import axios from 'axios'
import links from '@constants/links'

type Props = {
  children: ReactNode
}

export default function SellerLayout({ children }: Props) {
  const [loggedIn, setLoggedIn] = useState(false)

  const logout = () => {
    removeCookie('AUTH')
    window.location.href = '/'
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/api/seller/me',
      headers: {
        ...authHeader,
      },
    })
      .then(() => setLoggedIn(true))
      .catch(
        () =>
          // redirect to homepage is seller isn't logged in
          (window.location.href = links.SELLER.LOGIN)
      )
  }, [])

  if (!loggedIn) return null

  return (
    <div>
      <header className="container flex justify-between border-b border-grey-300 items-center">
        <div className="container flex justify-between items-center">
          <Link href="/">
            <a className="text-orange">Homepage</a>
          </Link>
          <nav>
            <ul className="flex items-center justify-center">
              <li className="mr-5">
                <Link href={links.SELLER.PRODUCTS}>
                  <a className="underline">Products</a>
                </Link>
              </li>
              <li>
                <button onClick={logout} className="underline">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {children}
    </div>
  )
}
