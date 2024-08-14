import Image from "next/image";
import styles from "./page.module.css";
import { AppBar, Button, Toolbar, Typography, Box, Grid } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { getStripe } from '../utils/stripe';

export default function Home() {
  // Stripe checkout for Pro plan
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <>
      {/* Header and Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          {/* Feature items */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6">Feature 1</Typography>
              <Typography>Feature description goes here.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6">Feature 2</Typography>
              <Typography>Feature description goes here.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6">Feature 3</Typography>
              <Typography>Feature description goes here.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6">Basic Plan</Typography>
              <Typography>$10/month</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Plan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6">Pro Plan</Typography>
              <Typography>$25/month</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                Choose Plan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}