import jwt from 'jsonwebtoken'

export const secret = process.env.JWT_SECRET_KEY

export const createToken = (obj: any) => jwt.sign({ ...obj }, secret as string)

export const isTokenValid = (token: string): any => {
  const tokenString = token.split(' ')[1] // the part of the token right after the 'Bearer '

  try {
    const decoded = jwt.verify(tokenString, secret as string)
    return decoded
  } catch {
    return false
  }
}

export const getTokenFromCookie = (req: any) => {
  const token = req.headers.authorization
  return token
}
