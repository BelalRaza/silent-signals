export const metadata = {
  title: 'Silent Signal | Account',
  description: 'Create or sign in to your Silent Signal account.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
