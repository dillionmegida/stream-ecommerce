import ProductInterface from '@interfaces/product.interface'
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
import SellerLayout from '@organisms/seller-layout'
import getAuthSeller from 'src/queries/getAuthSeller'
import getConversations from 'src/queries/getConversations'
import ConversationInterface from '@interfaces/conversation.interface'
import getMyProduct from 'src/queries/getMyProduct'

const ImageContainer = styled.div`
  height: 400px;
`

export default function Product() {
  const {
    query: { id },
  } = useRouter()

  const [product, setProduct] = useState<ProductInterface | null>(null)

  const [loggedInSeller, setLoggedInSeller] = useState(null)
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  )

  const [convoChannel, setConvoChannel] = useState(null)

  useEffect(() => {
    if (id)
      // because on mount, id can be undefined
      getMyProduct(id as string)
        .then((res) => {
          setProduct(res.data.product)
        })
        .catch(() => null)
  }, [id])

  useEffect(() => {
    if (product) {
      getConversations({ product_id: product._id })
        .then(({ data }) => setConversations(data.convos))
        .catch(() => null)
    }
  }, [product])

  useEffect(() => {
    getAuthSeller()
      .then((res) => {
        setLoggedInSeller(res.data)
      })
      .catch(() => null)
  }, [])

  const onClickViewConversation = (channelId: string) => {
    chatClient.connectUser(
      { id: loggedInSeller._id, email: loggedInSeller._email },
      chatClient.devToken(loggedInSeller._id)
    )

    // add the seller to the channel the buyer has created
    const channel = chatClient.channel('messaging', channelId)

    setConvoChannel(channel)
  }

  return (
    <SellerLayout>
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
              <div className="mt-5">
                {conversations.length < 1 ? (
                  <span>There are no conversations for this product</span>
                ) : (
                  conversations.map((c) => (
                    // load the different conversations different buyers have created
                    // for this product
                    <div className="mb-5">
                      {!convoChannel || convoChannel.id !== c._id ? (
                        <button
                          onClick={() => onClickViewConversation(c._id)}
                          className="p-3 bg-orange text-white"
                        >
                          View conversation
                        </button>
                      ) : (
                        <Chat client={chatClient}>
                          <Channel channel={convoChannel}>
                            <Window>
                              <ChannelHeader />
                              <MessageList />
                              <MessageInput />
                            </Window>
                          </Channel>
                        </Chat>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </SellerLayout>
  )
}
