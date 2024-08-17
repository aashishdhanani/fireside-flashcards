'use client'
import Image from "next/image";
import getStripe from '@/utils/get-stripe'
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import Head from 'next/head'
import Link from 'next/link'
import Features from './features/features';

export default function Home() {

  // const handleSubmit = async () => {
  //   const checkoutSession = await fetch('/api/checkout_session', {
  //     method: 'POST',
  //     headers: {
  //       origin: 'http://localhost:3000',
  //     },
  //   })

  //   const checkoutSessionJson = await checkoutSession.json()

  //   if (checkoutSession.statusCode === 500) {
  //     console.error(checkoutSession.message)
  //     return
  //   }

  //   const stripe = await getStripe()
  //   const {error} = await stripe.redirectToCheckout({
  //     sessionId: checkoutSessionJson.id,
  //   })

  //   if (error) {
  //     console.warn(error.message)
  //   }
  // }

  return (
    <Container maxWidth="100vw" sx={{ backgroundColor: '#2E2E2E', minHeight: '100vh', p: 2 }}>
      <Head>
        <title>Fireside Flashcards</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#2E2E2E'}}>
        <Toolbar>
          <Link href="/" passHref style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}> 
            <Typography 
              variant="h6"  
              style={{ flexGrow: 1, textDecoration: 'none', color: '#FCD19C', cursor: 'pointer' }}
            >
              Fireside Flashcards
            </Typography>
          </Link>
          <Button color="inherit" href="/profile">Profile</Button>
          <Button color="inherit" href="/generate">Generate</Button>
          <Button color="inherit" href="/flashcards">Flashcards</Button>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: 'center',
          my: 4,
        }}
      >
        <Typography variant="h2" sx={{ color: 'white' }} gutterBottom>
          Welcome to <span style={{ color: '#FCD19C' }}> Fireside Flashcards</span>
        </Typography>
        <Typography variant="h5" sx={{ color: 'white' }} gutterBottom>
          {' '}
          The easiest way to make flashcards from your text
        </Typography>
        <Button variant="contained" color="primary" sx = {{mt:2, backgroundColor: '#FCD19C', color: '#000', '&:hover': {backgroundColor: '#e0a44d',},}} href="/profile">
          Get Started
        </Button>
      </Box>
      <Box sx = {{textAlign: 'center', my: 6, color: 'white'}}>
<<<<<<< HEAD
        <Features />
=======
        <Typography variant="h4" sx={{ color: '#FCD19C' }} components="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
            <Typography>
              {' '}
              Our AI intelligently breaks down your text into concise flashcards.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
            <Typography>
              {' '}
              Easy access the flashcards on the go.
            </Typography>
          </Grid>
        </Grid>
>>>>>>> 72ea9a04ca9c16d07f036b0f30628ddf76defe3a
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: 'center', color: 'white' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ my: 4, color: '#FCD19C' }}>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
          <Grid item xs={12} sm={6} md={5}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2, 
              }}
            >
              <Typography variant="h5" sx={{ color: '#FCD19C' }} gutterBottom>
                Default Plan
              </Typography>
              <Typography variant="h6" gutterBottom>
                Free
              </Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: '#FCD19C', color: '#000', '&:hover': {backgroundColor: '#e0a44d',}, }} href="/profile">
                Choose Default
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2, 
              }}
            >
              <Typography variant="h5" sx={{ color: '#FCD19C' }} gutterBottom>
                Pro Plan
              </Typography>
              <Typography variant="h6" gutterBottom>
                $10 / month
              </Typography>
              <Typography>
                {' '}
                Access to premium flashcard features and unlimited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: '#FCD19C', color: '#000', '&:hover': {backgroundColor: '#e0a44d',}, }} href="/payment">
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
