import { SignIn } from '@clerk/nextjs'
import { AppBar, Container, Toolbar, Typography, Box, Button} from '@mui/material'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw" sx={{ backgroundColor: "#2E2E2E", minHeight: '100vh', p: 2 }}>
            <AppBar position="static" sx={{backgroundColor: "#2E2E2E"}}>
                <Toolbar>
                    <Link href="/" passHref style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}> 
                        <Typography 
                        variant="h6"  
                        style={{ flexGrow: 1, textDecoration: 'none', color: '#FCD19C', cursor: 'pointer' }}
                        >
                        Fireside Flashcards
                        </Typography>
                    </Link>
                    <Button color="inherit">
                        <Link style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} href="/sign-up" passHref>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                display = "flex"
                flexDirection="column"
                alignItems="center"
                justifyContents="center"
            >
                <Typography color="#FFFFFF" variant="h4">
                    Sign In
                </Typography>
                <SignIn />
            </Box>
        </Container>
    )
}