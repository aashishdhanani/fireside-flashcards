'use client'
import {useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'

import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'next/navigation'
import { Card, CardActionArea, CardContent, Container, Typography, Grid, Button, AppBar, Toolbar, CircularProgress, Box } from '@mui/material'
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import Link from 'next/link'

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in') // Redirect to sign-in page if not signed in
        }
    }, [isLoaded, isSignedIn, router])

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        if (isLoaded && isSignedIn) {
            getFlashcards()
        }
    }, [user, isLoaded, isSignedIn])

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
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
                    textAlign: 'center'
                }}
            >
                <CircularProgress sx={{ color: '#FCD19C', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#FCD19C' }}>
                    Loading your cards...
                </Typography>
            </Box>
        )
    }

    return (
        <Container maxWidth="100vw" sx={{ backgroundColor: '#2E2E2E', minHeight: '100vh', p: 0 }}>
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
            <Grid container spacing={3} sx={{mt: 4}}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                            sx={{
                                backgroundColor: '#FCD19C',
                            }}
                        >
                            <CardActionArea 
                                onClick={() => {
                                    handleCardClick(flashcard.name)
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}