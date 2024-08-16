'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { Box, CircularProgress, Container, Typography, AppBar, Toolbar, Button } from "@mui/material"
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import Link from 'next/link'

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return

            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            }
            catch (err) {
                setError("An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
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
                    Processing Payment...
                </Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Container 
                maxWidth='100vw'
                sx={{
                    textAlign: 'center',
                    mt: 4,
                }}
            >
                <Typography variant='h6'>{error}</Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth='100vw' sx={{ backgroundColor: '#2E2E2E', minHeight: '100vh', p: 2 }}>
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
            {session.payment === "paid" ? (
                <>
                    <Typography variant="h4" sx={{textAlign: 'center', mt: 4, color: 'white'}}>Thank you for purchasing</Typography>
                    <Box sx={{textAlign: 'center', mt: 22}}>
                        <Typography variant="h6">
                            Session ID: {session_id}
                        </Typography>
                        <Typography variant="body1" sx={{color: 'white'}}>
                            We have received your payment. You will receive an email with the order details shortly.
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="h4" sx={{textAlign: 'center', mt: 4, color: 'white'}}>
                        Payment Failed
                    </Typography>
                    <Box sx={{textAlign: 'center', mt: 22, color: 'white'}}>
                        <Typography variant="body1">
                            Your payment was not successful. Please try again.
                        </Typography>
                    </Box>
                </>
            )}
        </Container>
    )

}

export default ResultPage