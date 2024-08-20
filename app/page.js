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
          The easiest way to make flashcards from your CV
        </Typography>
        <Button variant="contained" color="primary" sx = {{mt:2, backgroundColor: '#FCD19C', color: '#000', '&:hover': {backgroundColor: '#e0a44d',},}} href="/profile">
          Get Started
        </Button>
      </Box>
      <Box sx = {{textAlign: 'center', my: 6, color: 'white'}}>
        <Features />
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

      {/* Footer Section */}
      <Box 
        component="footer"
        sx={{
          backgroundColor: '#1c1c1c',
          color: 'white',
          py: 4,
          mt: 'auto',
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="space-between" alignItem="center">
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography variant="h6">Fireside Flashcards</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                © {new Date().getFullYear()} FiresideAI. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography variant="h6">Links</Typography>
              <Box sx={{ 
                      mt: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                    }}>
                <Link href="/" passHref>
                  <Typography variant="body2" color="#FCD19C">Home</Typography>
                </Link>
                <br />
                <Link href="/profile" passHref>
                  <Typography variant="body2" color="#FCD19C">Profile</Typography>
                </Link>
                <br />
                <Link href="/generate" passHref>
                  <Typography variant="body2" color="#FCD19C">Generate</Typography>
                </Link>
                <br />
                <Link href="/flashcards" passHref>
                  <Typography variant="body2" color="#FCD19C">Flashcards</Typography>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography variant="h6">Contact</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Email: <Link href="mailto:firesideaiofficial@gmail.com" color="#FCD19C">firesideaiofficial@gmail.com</Link>
              </Typography>
              {/* <Typography variant="body2">
                <Link href="https://twitter.com/firesideflashcards" color="inherit" target="_blank" rel="noopener noreferrer">Twitter</Link> | 
                <Link href="https://github.com/firesideflashcards" color="inherit" target="_blank" rel="noopener noreferrer">GitHub</Link>
              </Typography> */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Container>
  );
}
