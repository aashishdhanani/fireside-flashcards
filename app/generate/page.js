'use client'
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { Container, Box, Typography, Paper, TextField, Button, Grid, CardActionArea, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar, CircularProgress } from '@mui/material'
import { db } from "@/firebase";
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore";
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import Link from 'next/link'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [paidUser, setPaidUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

   
    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                router.push('/sign-in')
                return
            }

            const checkPaidStatus = async () => {
                try {
                    setLoading(true); // Start loading
                    const userDocRef = doc(db, 'users', user.id);
                    const docSnap = await getDoc(userDocRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        
                        if (userData.paidUser) {
                            setIsAuthorized(true); // Allow page to render
                        } else {
                            setIsAuthorized(false); // Render the message for non-pro users
                        }
                    } else {
                        setIsAuthorized(false); // Render the message if user document doesn't exist
                    }
                } catch (error) {
                    console.error("Error checking user status:", error);
                    setIsAuthorized(false); // Render the message in case of an error
                } finally {
                    setLoading(false); // End loading
                }
            };

            checkPaidStatus();
        }
    }, [isLoaded, isSignedIn, user, router]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: '#FCD19C' }} />
            </Container>
        );
    }

    
    

    const handleSubmit = async () => {
        setGenerating(true);  // Start loading spinner when generating flashcards
        try {
            const res = await fetch('api/generate', {
                method: 'POST',
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await res.json();
            setFlashcards(data);
        } catch (error) {
            console.error("Error generating flashcards:", error);
        } finally {
            setGenerating(false);  // Stop loading spinner once flashcards are generated
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.')
                return
            }
            else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        }
        else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
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
            <Box
                sx={{
                    mt: 4,
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
                    Generate Flashcards
                </Typography>
                {!isAuthorized && (
                    <>
                        <Typography variant="h6" sx={{ color: 'red', mt: 2 }}>
                            This may only be accessed by Pro Plan Members or after a limited number of accesses.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => router.push('/payment')}
                            sx={{ backgroundColor: '#FCD19C', color: '#000', '&:hover': { backgroundColor: '#e0a44d' }, mt: 2 }}
                        >
                            Upgrade to Pro Plan
                        </Button>
                    </>
                )}
                {isAuthorized && (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ backgroundColor: '#FCD19C', color: '#000', '&:hover': { backgroundColor: '#e0a44d' } }}
                        >
                            Generate
                        </Button>
                    </>
                )}
            </Box>
    
            {generating && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100px',
                        backgroundColor: '#2E2E2E',
                        color: '#FCD19C',
                        textAlign: 'center',
                    }}
                >
                    <CircularProgress sx={{ color: '#FCD19C', mb: 2 }} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Generating flashcards...
                    </Typography>
                </Box>
            )}
    
            {flashcards.length > 0 && !generating && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'white', my: 4, textAlign: 'center' }}>
                        Flashcards Preview
                    </Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '300px',
                                                        maxWidth: '800px',
                                                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                        margin: 'auto',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h8" component="div" sx={{ textAlign: 'center' }}>
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}    