import { Container, Grid } from "@mui/material"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()


    // navigates to indivdual card sets
    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
      }

    // fetch user's flashcards
    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else{
                await speedDialActionClasses(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    // grid of flashcard sets
    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                    <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                        <CardContent>
                        <Typography variant="h5" component="div">
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