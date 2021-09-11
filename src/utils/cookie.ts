import Cookies from 'js-cookie'

type CookieKeys = 'AUTH'

export const setCookie = (key: CookieKeys, value: any) => {
  Cookies.set(key, value)
}

export const getCookie = (key: CookieKeys) => {
  return Cookies.get(key)
}

export const removeCookie = (key: CookieKeys) => {
  Cookies.remove(key)
}

export const authHeader = {
  Authorization: `Bearer ${getCookie('AUTH')}`,
}
