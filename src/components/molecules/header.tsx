import links from '@constants/links'
import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <div className="container flex justify-between border-b border-grey-300 items-center">
        <Link href="/">
          <a className="text-orange">Ecommerce</a>
        </Link>

        <nav>
          <ul className="flex items-center">
            <li className="mr-5">
              <Link href={links.BUYER.LOGIN}>
                <a className="block py-2 px-6 text-grey-600 border border-orange">
                  Buyer Login
                </a>
              </Link>
            </li>
            <li>
              <Link href={links.SELLER.LOGIN}>
                <a className="block py-2 px-6 text-white bg-orange">
                  Seller Login
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
