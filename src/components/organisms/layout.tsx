import Footer from '@molecules/footer'
import styled from 'styled-components'
import Header from '../molecules/header'

const Children = styled.div`
  min-height: 600px;
`

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <Header />
      <Children className="mt-5 mb-10">{children}</Children>
      <Footer />
    </div>
  )
}
