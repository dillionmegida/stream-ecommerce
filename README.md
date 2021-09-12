# Stream Ecommerce

This is a sample project showing how to integrate [the React SDK for Stream](https://github.com/dillionmegida/stream-ecommerce) in an ecommerce application.

## Table of Contents

- [Description](#description)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
- [Running the project](#running-the-project)
  - [Clone the project](#clone-the-project)
  - [Installation](#installation)
  - [Configuring your Database](#configuring-your-database)
  - [Adding the environment variables](#adding-the-environment-variables)
  - [Running the server](#running-the-server)
  - [Viewing the database](#viewing-the-database)
- [Deployment](#deployment)
- [Author](#author)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Description

The project is built with [Next.js](https://nextjs.org/) which serves the frontend and the backend environments. And, MongoDB is used as the database. In this project, I've integrated the SDK in supporting conversations between buyers and sellers over a product in the application.

For each product, buyers and sellers can communicate with each other. The seller can also manage multiple conversations with different buyers for the same product.

## Getting Started

### Requirements

- [MongoDB (Community Version)](https://docs.mongodb.com/manual/administration/install-community/) installed on your machine, and also ensure that the MongoDB service is running.
- [Node.js](https://nodejs.org/en/) installed on your machine
- [Stream Account](https://getstream.io/try-for-free/)
- Additionally, you can install [MongoDB Compass](https://www.mongodb.com/try/download/compass) which serves as a GUI for viewing your MongoDB databases.

## Running the project

### Clone the project

```bash
git clone git@github.com:dillionmegida/stream-ecommerce.git
```

### Installation

The dependencies are in the `package.json` file. After cloning, run the following command to install the dependencies:

```bash
cd stream-ecommerce
npm install
```

### Configuring your Database

Open the MongoDB Compass application, and click on "Connect". This will create a connection to the database at `http://localhost:27017` host.

At the bottom, you will see a "Add Database" button. Click on it, and enter the name of the database you want to use. For this project, I used "stream-ecommerce". And for the "Collection Name", I used "products". Then click on "Create Database".

Now, your `MONGODB_URI` is `mongodb://localhost:27017/stream-ecommerce` which you can connect to from the application.

### Adding the environment variables

In the `.env.local.example`, you can find the environment variables needed for the project. They are:

```env
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=

MONGODB_URI=

JWT_SECRET_KEY=
```

Copy all of these environment variables to `.env.local` and replace the values with your own.

- You can get the `NEXT_PUBLIC_STREAM_API_KEY` and `STREAM_SECRET_KEY` from [the Stream Dashboard](https://dashboard.getstream.io/dashboard)
- You can get the `MONGODB_URI` [here](https://github.com/dillionmegida/stream-ecommerce#configuring-your-database)
- Your `JWT_SECRET_KEY` can be any string. For example, "ecommerce-stream". It's used for creating tokens for authentication.

### Running the server

```bash
npm run dev
```

The `pages/api/` directory contains the API endpoints which can be accessed on `localhost:3000/api/*`.

And the application can be run on `localhost:3000`.

### Viewing the database

When you open the MongoDB Compass to view the database, the database will only have the products collection, but it would be empty. To populate the database, you can signup as a seller. And in the Compass app, you'll see the "sellers" collection with the new seller.

So, you can go ahead to add more models and collections.

### Deployment

You can deploy the Next.js application to [Vercel](https://nextjs.org/docs/deployment) seamlessly. For your MongoDB database, you can create your database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/). From Atlas, you can get your URI and use that in your environment variable.

You can also use the [MongoDB Compass](https://www.mongodb.com/try/download/compass) to view the database on Atlas. You just need to connect using the URI from Atlas.

## Author

[Dillion Megida](https://github.com/dillionmegida)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.

## Acknowledgements

Inspiration for this project came from [Nick Parsons](https://twitter.com/nickparsons) who wanted to show different ways to integrate Stream.
