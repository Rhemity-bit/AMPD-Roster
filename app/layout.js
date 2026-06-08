export const metadata = {
  title: 'Aftermath Police Force — Personnel Roster',
  description: 'City of Aftermath official police department roster',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#080C14' }}>{children}</body>
    </html>
  )
}
