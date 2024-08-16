import { SignUp } from '@clerk/nextjs'
import { AppBar, Container, Toolbar, Typography, Box, Button} from '@mui/material'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw">
            <AppBar position="static" sc={{backgroundColor: "#3f51b5"}}>
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
                <Typography variant="h4">
                    Sign Up
                </Typography>
                <SignUp />
            </Box>
        </Container>
    )
}