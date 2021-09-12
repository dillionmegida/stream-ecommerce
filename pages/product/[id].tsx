import ProductInterface from '@interfaces/product.interface'
import Layout from '@organisms/layout'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from 'stream-chat-react'
import { chatClient } from 'src/utils/stream'
import getAuthBuyer from 'src/queries/getAuthBuyer'
import startConversation from 'src/queries/startConversation'
import { toast } from 'react-toastify'
import SellerInterface from '@interfaces/seller.interface'

const ImageContainer = styled.div`
  height: 400px;
`

export default function Product() {
  const {
    query: { id },
  } = useRouter()

  const [product, setProduct] = useState<ProductInterface | null>(null)

  const [loggedInBuyer, setLoggedInBuyer] = useState<SellerInterface | null>(
    null
  )

  const [convoChannel, setConvoChannel] = useState(null)

  useEffect(() => {
    if (id)
      // because on mount, id can be undefined
      axios({ url: `/api/product/${id}`, method: 'GET' }).then((res) =>
        setProduct(res.data.product)
      )
  }, [id])

  useEffect(() => {
    getAuthBuyer()
      .then((res) => {
        setLoggedInBuyer(res.data)
      })
      .catch(() => null)
  }, [])

  const startConvo = async () => {
    try {
      const res = await startConversation({
        product_id: product._id,
        seller_id: product.seller._id,
      })

      const {
        convo: { channelId },
      } = res.data

      chatClient.connectUser(
        {
          id: loggedInBuyer._id,
          email: loggedInBuyer.email,
        },
        chatClient.devToken(loggedInBuyer._id)
      )

      const channel = chatClient.channel('messaging', channelId, {
        name: `Conversation between ${loggedInBuyer.email} and ${product.seller.email} for ${product.name}`,
        members: [loggedInBuyer._id],
      })

      setConvoChannel(channel)
    } catch (err) {
      toast.error('Unable to start conversation with this seller')
    }
  }

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
                {loggedInBuyer && (
                  <>
                    {!convoChannel ? (
                      <button
                        onClick={startConvo}
                        className="mt-5 bg-orange text-white p-3"
                      >
                        Start a Conversation with the Seller
                      </button>
                    ) : (
                      <div className="mt-5 border border-orange">
                        <Chat client={chatClient}>
                          <Channel channel={convoChannel}>
                            <Window>
                              <ChannelHeader />
                              <MessageList />
                              <MessageInput />
                            </Window>
                          </Channel>
                        </Chat>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}
