export const metadata = {
  title: 'Food Delivery App',
  description: 'Food Delivery Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



