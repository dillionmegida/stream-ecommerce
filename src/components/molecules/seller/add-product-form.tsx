import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { authHeader, getCookie } from 'src/utils/cookie'

type InputValues = {
  name: string
  description: string
  price: number
  image: string
}

type Props = {}

export default function AddProductForm({}: Props) {
  const { handleSubmit, register } = useForm<InputValues>()

  const [processing, setProcessing] = useState(false)

  const onSubmit = async (values: InputValues) => {
    const { name, description, price, image } = values

    setProcessing(true)

    try {
      const res = await axios({
        method: 'post',
        url: '/api/product',
        headers: {
          ...authHeader,
        },
        data: {
          name,
          description,
          price,
          image,
        },
      })

      toast.success('Product added successfully')

      window.location.href = `/product/${res.data.product._id}`
    } catch (err) {
      setProcessing(false)
      toast.error(err.response.data.message)
    }
  }

  return (
    <div className="max-w-lg my-5 mx-auto p-10 bg-grey-100">
      <h1 className="text-3xl text-center">Add Product</h1>
      <p className="my-3 text-center block text-orange">
        Enter the details of the product you want to add
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 w-full rounded-lg"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Product Name
          </label>
          <input
            className="p-3 border border-grey-200 w-full"
            id="name"
            name="name"
            ref={register({ required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block mb-2">
            Image URL
          </label>
          <input
            name="image"
            id="image"
            className="p-3 border border-grey-200 w-full"
            ref={register({ required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block mb-2">
            Price (in $)
          </label>
          <input
            name="price"
            id="price"
            type="number"
            className="p-3 border border-grey-200 w-full"
            ref={register({ required: true })}
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className="p-3 border border-grey-200 w-full"
            ref={register({ required: true })}
          />
        </div>
        <button
          type="submit"
          className="w-full uppercase mt-10 mx-auto py-3 px-5 bg-grey-700 text-white"
        >
          {processing ? 'Processing...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
