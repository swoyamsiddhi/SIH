import './globals.css'
import { RoleSwitcher } from '../src/components/ui'

export const metadata = {
  title: 'KHEL-NET',
  description: 'India\'s AI-powered sports talent assessment platform',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <RoleSwitcher />
        {children}
      </body>
    </html>
  )
}
