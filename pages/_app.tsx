import { ToastContainer } from 'react-toastify'
import '../src/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'stream-chat-react/dist/css/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
