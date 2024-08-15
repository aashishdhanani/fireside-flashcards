import { SignUp } from '@clerk/nextjs'
import { AppBar, Container, Toolbar, Typography, Box, Button} from '@mui/material'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw">
            <AppBar position="static" sc={{backgroundColor: "#3f51b5"}}>
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        sx={{
                            flexGrow: 1
                        }}
                    >
                        Fireside Flashcards
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
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
    );
}