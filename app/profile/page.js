"use client"
import * as React from 'react';
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Box, Button, Container, TextField, Typography, Paper, Grid, Fade, AppBar, Toolbar } from "@mui/material";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel, Checkbox } from '@mui/material';
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import Link from 'next/link'

export default function Profile() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [experiences, setExperiences] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [currentlyWorking, setCurrentlyWorking] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentExperience, setCurrentExperience] = useState({});
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in') // Redirect to sign-in page if not signed in
        }
    }, [isLoaded, isSignedIn, router])

    if (!isLoaded || !isSignedIn) {
        return <Typography>Loading...</Typography> // Display loading or message until user status is determined
    }

    const handleCheckboxChange = (event) => {
        setCurrentlyWorking(event.target.checked);
    };

    const handleClickOpen = () => {
        setEditIndex(null);
        setCurrentlyWorking(false);
        setCurrentExperience({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addExperience = (experience) => {
        if (editIndex !== null) {
            const updatedExperiences = experiences.map((exp, index) =>
                index === editIndex ? { ...experience, currentlyWorking } : exp
            );
            setExperiences(updatedExperiences);
        } else {
            setExperiences([...experiences, { ...experience, currentlyWorking }]);
        }
        handleClose();
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        const experience = experiences[index];
        setCurrentExperience(experience);
        setCurrentlyWorking(experience.currentlyWorking);
        setOpen(true);
    };

    const handleDelete = (index) => {
        if (index >= 0 && index < experiences.length) {
            setExperiences(experiences.filter((_, i) => i !== index));
        }
    };

    return (
        <Container maxWidth="100%" sx={{ backgroundColor: '#2E2E2E', minHeight: '100vh', p: 0 }}>
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
                <SignedOut>
                    <Button color="inherit" href="/sign-in">Login</Button>
                    <Button color="inherit" href="/sign-up">Sign Up</Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                </Toolbar>
            </AppBar>
            <Fade in={true} timeout={1000}>
                <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, backgroundColor: '#1C1C1C' }}>
                    <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#FCD19C' }}>
                        Your Profile
                    </Typography>
                    <form>
                        <Grid container spacing={4}>
                            <ProfileSection title="Education">
                                <CustomTextField
                                    label="Highest level of education and field of study"
                                    placeholder="e.g., Bachelor's in Computer Science"
                                />
                                <CustomTextField
                                    label="Relevant certifications"
                                    placeholder="e.g., AWS Certified Solutions Architect"
                                />
                            </ProfileSection>

                            <ProfileSection title="Work Experience">
                                <Typography variant="body1" gutterBottom sx={{ color: '#FCD19C' }}>
                                    Add your relevant work experiences below:
                                </Typography>
                                {experiences.map((exp, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #FCD19C', borderRadius: 2, backgroundColor: '#333' }}>
                                        <Typography variant="body1" sx={{ color: '#fff' }}>
                                            {exp.Company} - {exp.Position}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#ccc' }}>
                                            {exp['Start Date']} - {exp.currentlyWorking ? 'Present' : exp['End Date']}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Button
                                                onClick={() => handleEdit(index)}
                                                sx={{ color: '#FCD19C' }}
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(index)}
                                                sx={{ color: '#FCD19C' }}
                                                startIcon={<DeleteIcon />}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={handleClickOpen}
                                    sx={{ mt: 2, borderColor: '#FCD19C', color: '#FCD19C' }}
                                >
                                    Add Work Experience
                                </Button>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                        component: 'form',
                                        onSubmit: (event) => {
                                            event.preventDefault();
                                            const formData = new FormData(event.currentTarget);
                                            const formJson = Object.fromEntries(formData.entries());
                                            addExperience(formJson);
                                        },
                                    }}
                                >
                                    <DialogTitle>Work Experience</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Add your work experience here. Be as detailed as possible in your descriptions.
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="company-name"
                                            name="Company"
                                            label="Company Name"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            defaultValue={currentExperience.Company || ''}
                                        />
                                        <TextField
                                            required
                                            margin="dense"
                                            id="position"
                                            name="Position"
                                            label="Position"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            defaultValue={currentExperience.Position || ''}
                                        />
                                        <TextField
                                            required
                                            margin="dense"
                                            id="start-date"
                                            name="Start Date"
                                            label="Start Date"
                                            type="date"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="standard"
                                            defaultValue={currentExperience['Start Date'] || ''}
                                        />
                                        {!currentlyWorking && (
                                            <TextField
                                                margin="dense"
                                                id="end-date"
                                                name="End Date"
                                                label="End Date"
                                                type="date"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="standard"
                                                defaultValue={currentExperience['End Date'] || ''}
                                            />
                                        )}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={currentlyWorking}
                                                    onChange={handleCheckboxChange}
                                                    name="currentlyWorking"
                                                    color="primary"
                                                />
                                            }
                                            label="Currently Working Here"
                                        />
                                        <TextField
                                            margin="dense"
                                            id="description"
                                            name="Description"
                                            label="Description"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="standard"
                                            defaultValue={currentExperience.Description || ''}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="personal-experience"
                                            name="Personal Experience"
                                            label="Personal Experience"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="standard"
                                            defaultValue={currentExperience['Personal Experience'] || ''}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="skills"
                                            name="Skills"
                                            label="Skills Used/Learned"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            variant="standard"
                                            defaultValue={currentExperience.Skills || ''}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button type="submit">Save Experience</Button>
                                    </DialogActions>
                                </Dialog>
                            </ProfileSection>

                            <ProfileSection title="Career Goals">
                                <CustomTextField
                                    label="Short-term and long-term goals"
                                    placeholder="Describe your career aspirations"
                                />
                                <CustomTextField
                                    label="Where do you see yourself in 5 years?"
                                    placeholder="Your future vision"
                                />
                            </ProfileSection>

                            <ProfileSection title="Skills">
                                <CustomTextField
                                    label="Top three professional skills"
                                    placeholder="e.g., Leadership, Problem-solving, Python"
                                />
                                <CustomTextField
                                    label="Strengths and areas to improve"
                                    placeholder="Professional strengths and development areas"
                                />
                            </ProfileSection>

                            <ProfileSection title="Additional Information">
                                <CustomTextField
                                    label="Anything else you'd like to add"
                                    placeholder="Other relevant information"
                                />
                            </ProfileSection>
                        </Grid>

                        <Button
                            variant="outlined"
                            endIcon={<SendIcon />}
                            sx={{
                                mt: 4,
                                backgroundColor: '#FCD19C',
                                color: "black",
                                ":hover": { backgroundColor: 'rgba(251, 185, 102, 0.7)' }
                            }}
                            onClick={() => alert('Profile updated!')}
                        >
                            Update Profile
                        </Button>
                    </form>
                </Paper>
            </Fade>
        </Container>
    );
}

const ProfileSection = ({ title, children }) => (
    <Grid item xs={12}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FCD19C', mb: 2, textDecoration: 'underline' }}>
            {title}
        </Typography>
        {children}
    </Grid>
);

const CustomTextField = ({ label, placeholder }) => (
    <TextField
        fullWidth
        variant="outlined"
        label={label}
        placeholder={placeholder}
        multiline
        rows={2}
        margin="normal"
        sx={{
            backgroundColor: '#333',
            color: '#FCD19C', 
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#FCD19C', 
                },
                '&:hover fieldset': {
                    borderColor: '#fff', 
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#fff', 
                },
                '& .MuiInputBase-input': {
                    color: '#fff', 
                },
                '& .MuiInputBase-input::placeholder': {
                    color: '#fff', 
                },
            },
            '& .MuiInputLabel-root': {
                color: '#FCD19C', 
            },
            '& .MuiInputLabel-root.Mui-focused': {
                color: '#FCD19C', 
            },
        }}
    />
);