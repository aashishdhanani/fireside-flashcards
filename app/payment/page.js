'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import getStripe from '@/utils/get-stripe'
import { useRouter } from 'next/navigation'
import { Box, Button, CircularProgress, Typography, Container } from '@mui/material'

export default function PaymentPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in') // Redirect to sign-in page if not signed in
    }
  }, [isLoaded, isSignedIn, router])

  const handleCheckout = async () => {
    if (!isLoaded || !isSignedIn) return // Prevent checkout if user is not signed in

    setLoading(true)

    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }), // Pass user ID to backend
      })

      const checkoutSessionJson = await checkoutSession.json()

      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message)
        return
      }

      const stripe = await getStripe()
      const {error} = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      })

      if (error) {
        console.warn(error.message)
      }

    //   if (checkoutSessionJson.url) {
    //     // Redirect to Stripe checkout
    //     window.location.href = checkoutSessionJson.url
    //   } else {
    //     console.error('Failed to get Stripe checkout URL')
    //   }
    } catch (error) {
      console.error('Error initiating checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#2E2E2E',
          color: '#FCD19C',
          textAlign: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#FCD19C', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#FCD19C' }}>
          Loading...
        </Typography>
      </Box>
    )
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        backgroundColor: '#2E2E2E',
        minHeight: '100vh',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" sx={{ color: '#FCD19C', mb: 4 }}>
        Subscribe to Pro Plan
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
        disabled={loading}
        sx={{ backgroundColor: '#FCD19C', color: '#2E2E2E', '&:hover': {backgroundColor: '#e0a44d',}, }}
      >
        {loading ? 'Processing...' : 'Checkout with Stripe'}
      </Button>
    </Container>
  )
}