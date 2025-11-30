import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { LessonContext } from '../context/LessonContext';

const Home = () => {
  const { lessons } = useContext(LessonContext);
  
  // Featured lessons (first 3)
  const featuredLessons = lessons.slice(0, 3);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: 2,
          mb: 4,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://source.unsplash.com/random/1200x400/?nature)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Sustainable Living Education Platform
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          Learn how to live sustainably and make a positive impact on our planet.
          Explore our interactive lessons, projects, and resources.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" component={RouterLink} to="/lessons">
                Explore Lessons
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" sx={{ color: 'white', borderColor: 'white' }} component={RouterLink} to="/resources">
                View Resources
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Featured Lessons Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Featured Lessons
        </Typography>
        <Grid container spacing={4}>
          {featuredLessons.map((lesson) => (
            <Grid item key={lesson.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={lesson.imageUrl}
                  alt={lesson.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {lesson.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lesson.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {lesson.difficulty}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lesson.duration}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" component={RouterLink} to={`/lessons/${lesson.id}`}>
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" component={RouterLink} to="/lessons">
            View All Lessons
          </Button>
        </Box>
      </Box>

      {/* About Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              About Our Platform
            </Typography>
            <Typography paragraph>
              The Sustainable Living Education Platform is dedicated to providing high-quality educational content about sustainable living practices. Our mission is to empower individuals with the knowledge and tools they need to make environmentally conscious decisions in their daily lives.
            </Typography>
            <Typography paragraph>
              Through interactive lessons, practical projects, and comprehensive resources, we cover a wide range of sustainability topics including renewable energy, waste reduction, water conservation, sustainable transportation, and eco-friendly lifestyle choices.
            </Typography>
            <Button variant="outlined" color="primary" component={RouterLink} to="/about">
              Learn More About Us
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://source.unsplash.com/random/600x400/?sustainability"
              alt="Sustainable living"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;