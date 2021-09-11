import { useForm } from 'react-hook-form'
import Link from 'next/link'

type InputValues = {
  email: string
  password: string
}

type Props = {
  processing?: boolean
  onSubmit: (values: InputValues) => void
  heading: string
  submitText?: string
  belowFormContent?: React.ReactNode
  type: 'register' | 'login'
  altLink: string
}

export default function AuthForm({
  processing,
  onSubmit,
  heading,
  submitText = 'Submit',
  belowFormContent,
  type,
  altLink,
}: Props) {
  const { handleSubmit, register } = useForm<InputValues>()

  return (
    <div className="max-w-lg mx-auto p-10 bg-grey-100">
      <h1 className="text-3xl text-center">{heading}</h1>
      <Link href={altLink}>
        <a className="my-3 text-center block text-orange">
          {type === 'register' ? 'Login' : 'Create an account'}
        </a>
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 w-full rounded-lg"
      >
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            className="p-3 border border-grey-200 w-full"
            type="email"
            id="email"
            name="email"
            ref={register({ required: true })}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            name="password"
            id="password"
            className="p-3 border border-grey-200 w-full"
            type="password"
            ref={register({ required: true })}
          />
        </div>
        <button
          type="submit"
          className="w-full uppercase mt-10 mx-auto py-3 px-5 bg-grey-700 text-white"
        >
          {processing ? 'Processing...' : submitText}
        </button>
      </form>
      <div className="mt-4">{belowFormContent}</div>
    </div>
  )
}
