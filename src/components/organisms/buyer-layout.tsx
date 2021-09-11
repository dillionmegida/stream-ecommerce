import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { authHeader, removeCookie } from 'src/utils/cookie'
import axios from 'axios'
import links from '@constants/links'

type Props = {
  children: ReactNode
}

export default function BuyerLayout({ children }: Props) {
  const [loggedIn, setLoggedIn] = useState(false)

  const logout = () => {
    removeCookie('AUTH')
    window.location.href = '/'
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/api/buyer/me',
      headers: {
        ...authHeader,
      },
    })
      .then(() => setLoggedIn(true))
      .catch(
        () =>
          // redirect to homepage is buyer isn't logged in
          (window.location.href = links.BUYER.LOGIN)
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
