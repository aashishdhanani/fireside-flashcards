import Image from "next/image";
import getStripe from '@/utils/get-stripe'
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import Head from 'next/head'

export default function Home() {
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Fireside Flashcards</Typography>
          <SignedOut>
            <Button color="inherit">Login</Button>
            <Button color="inherit">Sign Up</Button>
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
        <Typography variant="h2" gutterBottom>
          Welcome to Fireside Flashcards
        </Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          The easiest way to make flashcards from your text
        </Typography>
        <Button variant="contained" color="primary" sc = {{mt:2}}>
          Get Started
        </Button>
      </Box>
      <Box sx = {{my: 6}}>
        <Typography variant="h4" components="h2" gutterBottom>
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
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
          <Grid item xs={12} sm={6} md={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2, 
              }}
            >
              <Typography variant="h5" gutterBottom>
                Basic Plan
              </Typography>
              <Typography variant="h6" gutterBottom>
                $5 / month
              </Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2, 
              }}
            >
              <Typography variant="h5" gutterBottom>
                Pro Plan
              </Typography>
              <Typography variant="h6" gutterBottom>
                $25 / month
              </Typography>
              <Typography>
                {' '}
                Access to premium flashcard features and unlimited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
