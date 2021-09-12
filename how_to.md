# How to build an Ecommerce application that integrates Stream for Buyer-Seller Communication

E-commerce applications are platforms that allows sellers to sell their products and buyers to buy products from the sellers. In this article, we will build an ecommerce application that integrates [the React SDK for Stream](https://getstream.io/chat/sdk/react/) for supporting conversations between buyers and sellers.

We'll be building this application using this Next.js-Ecommerce template as our starting point: [ecommerce-nextjs-mongodb](https://github.com/dillionmegida/ecommerce-nextjs-mnogodb). The template uses Next.js for managing the frontend and backend environments, with MongoDB serving as the database.

## Requirements

You must have a Stream Account to use Stream. If you don't have one, you can [sign up for one](https://getstream.io/try-for-free/).

You also need to have MongoDB installed locally. You can install it with [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/). Also, ensure that you have the MongoDB service running on your machine.

Lastly, you'll need to have Node.js installed locally. You can install it with [Node.js](https://nodejs.org/en/).

## Prerequisites

To get a better understanding with this article, familiarity with MongoDB, creating models and schemas, and Next.js is required.

## Contents

- [What is Stream?](#what-is-stream)
- [Brief overview of Next.js](#brief-overview-of-nextjs)
- [Running the template](#running-the-template)
- [Building the Backend](#building-the-backend)
  - [Connecting the database](#connecting-the-database)
  - [Creating the conversation models](#creating-the-models)
  - [Creating the conversation APIs](#creating-the-apis)
- [Building the Frontend](#building-the-frontend)
  - [Creating the pages](#creating-the-pages)
- [Conclusion](#conclusion)

## What is Stream?

Stream is a messaging-product that provides all of your messaging needs. From Threads, to one-on-one conversations, to channels, to groups, Stream supports all of it.

Stream also provides many SDKs that allow you to integrate with your existing applications. For example, in this tutorial, we'll be integrating the React SDK.

## Brief overview of Next.js

Next.js is a React-based framework that supports server-side rendering for building applications. Added to this, Next.js also supports backend environments which allow you to create APIs that your frontend can call.

In the rest of this article, we'll see how to create APIs and integrate MongoDB with Next.js.

## Running the template

To view the result of the template, you'll need to run the following command:

```bash
# clone the template
git clone git@github.com:dillionmegida/ecommerce-nextjs-mnogodb.git
# cd into the project directory
cd ecommerce-nextjs-mnogodb
# install dependencies
npm install
```

Before running the server, we need to provide some environment variables.

Rename the `.env.local.example` file to `.env.local` and add the following environment variables:

```bash
MONGODB_URI=

JWT_SECRET_KEY=
```

The `MONGODB_URI` variable should be set to the URI of your MongoDB instance. The `JWT_SECRET_KEY` variable should be set to a secret key that is used to sign the JWT tokens. You can use any string for this.

The development server is live on `http://localhost:3000`:

![Homepage of development server](./images/homepage-screenshot.png)

You can create a seller account and also add products to see this page populated.

## Building the Backend

The template we're using already has the backend setup. But let's briefly look at some important files:

- `server/middlewares/database.ts`:

```typescript
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

async function databaseMiddleware(req, res, next) {
  await mongoose.connect(uri)
  return next()
}

export default databaseMiddleware
```

This is a middleware that is used on every API to ensure connection to the database. This is required before models can make changes to the db. You can see how the models are used in `pages/api/product/index.ts` create a product, and get all products.

## Creating the conversation model

To proceed, let's create a `Conversation` model. In the `server/models` directory, create a `conversation.model.ts` file with the following code:

```typescript
import mongoose, { Schema } from 'mongoose'

const Conversation = new Schema({
  _id: String,
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  buyer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
  },
  seller_id: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
})

export default mongoose.models.Conversation || // incase the model is already defined
  mongoose.model('Conversation', Conversation, 'conversations')
```

This model manages the conversation between a buyer and a seller on a product.

> When you define a model, and attempt to use it twice, you'll get an error, stating a multiple definition of the model. This is because Next.js has already compiled the previous model, and it is attempted to be defined again. To avoid this, we check using:
> mongoose.models.Conversation ||
> mongoose.model(
> 'Conversation',
> Conversation,
> 'conversations'
> )

## Creating the conversation APIs

We'll create two APIs:

- one for starting a conversation, which will be initiated by the buyer
- and the second for getting all conversations on a particular product, meant for the seller's view

For the first API, in the `pages/api` directory, create a `conversation/index.ts` file with the following code:

```typescript
import { StatusCodes } from '@enums/StatusCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { Mongoose } from 'mongoose'
import databaseMiddleware from 'server/middlewares/database'
import isAuthenticated from '@middlewares/isAuthenticated'
import conversationModel from 'server/models/conversation.model'
import { nanoid } from 'nanoid'

const handler = nc()
  .use(databaseMiddleware, isAuthenticated)
  .post(
    async (
      req: NextApiRequest & {
        db: Mongoose // db is coming from the databaseMiddleware

        user: { _id: string } // user is coming from the isAuthenticated middleware,
      },
      res: NextApiResponse
    ) => {
      const { product_id, seller_id } = req.body

      try {
        const existingConversation = await conversationModel.findOne({
          product_id,
          seller_id,
          buyer_id: req.user._id,
        })

        const channelId = existingConversation?._id || nanoid()

        if (!existingConversation) {
          await conversationModel.create({
            _id: channelId,
            product_id,
            seller_id,
            buyer_id: req.user._id,
          })
        }

        res.json({
          convo: {
            channelId,
          },
        })
      } catch (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to start a conversation at the moment' })
      }
    }
  )

export default handler
```

Using [`next-connect`](https://www.npmjs.com/package/next-connect) (an API routing middleware for Next.js), we've created a `handler` that will be used to handle the API. The handler also uses the `isAuthenticated` middleware to verify that a buyer is authenticated.

We check for an existing conversation by looking for a conversation with the same product, seller and buyer. If there is an existing conversation, we return the channel ID (which is the `_id` of the conversation). If there isn't an existing conversation, we create a new conversation and return the channel ID. This channel ID is required by Stream to create unique channels for each conversation. We'll see that later in the article

## Building the frontend

First, we need to install the dependencies for Stream. Run the following code:

```bash
npm install stream-chat stream-chat-react
```

First, let's create a stream utility file. Create a new file `src/utils/stream.ts` with the following code:

```typescript
import { StreamChat } from 'stream-chat'

export const chatClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY
)
```

Basically, we're creating a new instance of StreamChat, and passing in the API key.

You need to add this API key to your `.env.local` file while you'll get from [the Stream Dashboard](https://dashboard.getstream.io/dashboard).

Then you have to restart your server so that the new env variable is available.

Now, go to the `pages/product/[id].tsx` file. First, add the stream imports:


```jsx
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from 'stream-chat-react'
import { chatClient } from 'src/utils/stream'
```

Now, add the following code after the `useEffect` hook:

```jsx
const [loggedInBuyer, setLoggedInBuyer] = useState(null)

const [convoChannel, setConvoChannel] = useState(null)

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
```

First, we get the logged in buyer and then we have a `startConvo` function. When this function is called, we make a request to the existing API to retrieve the `channelID`.

Then, we connect the buyer to the stream client instance.

> Ideally, tokens for connecting users are generated on the server, and then passed to the client. However, we're using the [`devToken`](https://getstream.io/chat/docs/react/tokens_and_authentication/?language=javascript) which we can use for development purposes.

And, we create a channel with the `channelId` and the `name` of the channel.

Immediately after the description element in the code, add the following:

```jsx
...
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
```

This checks in the buyer is logged in and then checks if there is a conversation channel. If there is a conversation channel, we display the conversation. If there isn't a conversation channel, we display a button that will start a conversation.

To see this on the UI, you first have to create an account as a buyer. Head over to `localhost:3000/buyer/register` and fill out the form.

And then, on a different browser, create a seller account on `localhost:3000/seller/register` and add a product. You can get public image URLs from [https://picsum.photos/images](https://picsum.photos/images)

Going back to `localhost:3000` should look like this:

![Homepage with product](./images/homepage-with-product.png).

And clicking on the product should display this:




