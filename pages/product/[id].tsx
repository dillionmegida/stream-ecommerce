import ProductInterface from '@interfaces/product.interface'
import Layout from '@organisms/layout'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const ImageContainer = styled.div`
  height: 400px;
`

export default function Product() {
  const {
    query: { id },
  } = useRouter()

  const [product, setProduct] = useState<ProductInterface | null>(null)

  useEffect(() => {
    if (id)
      // because on mount, id can be undefined
      axios({ url: `/api/product/${id}`, method: 'GET' }).then((res) =>
        setProduct(res.data.product)
      )
  }, [id])

  return (
    <Layout>
      <main>
        <div className="container">
          {!product ? (
            <div>Fetching product...</div>
          ) : (
            <div className="container">
              <h1 className="text-3xl">{product.name}</h1>
              <ImageContainer className="mt-5">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </ImageContainer>
              <div className="mt-5">
                <span>
                  Price: <b>${product.price}</b>
                </span>
                <p className="mt-5">Description: {product.description}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}
