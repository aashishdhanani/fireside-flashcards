'use client'
import {useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'

import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'next/navigation'
import { Card, CardActionArea, CardContent, Container, Typography, Grid, Button, AppBar, Toolbar } from '@mui/material'
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
        return <Typography>Loading...</Typography> // Display loading or message until user status is determined
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
                        <Card>
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