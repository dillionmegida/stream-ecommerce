import ProductInterface from '@interfaces/product.interface'
import Layout from '@organisms/layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const ProductBlock = styled.a`
  height: 300px;
`

export default function Home() {
  const [products, setProducts] = useState<ProductInterface[] | null>(null)

  useEffect(() => {
    axios({ method: 'GET', url: '/api/product' }).then((res) =>
      setProducts(res.data.products)
    )
  }, [])

  return (
    <Layout>
      <main>
        <div className="container">
          <h1 className="text-3xl">Products</h1>
          {!products && <span>Fetching Products...</span>}
          {products && (
            <>
              {products.length < 1 ? (
                <span>No products found</span>
              ) : (
                <div className="grid grid-cols-3 mt-5 mb-10 gap-10">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      passHref
                    >
                      <ProductBlock className="border border-grey-100 flex flex-col">
                        <div className="flex-1 overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5 h-20 flex justify-between">
                          <h3>{product.name}</h3>
                          <span className="font-bold">${product.price}</span>
                        </div>
                      </ProductBlock>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  )
}
