import { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Avatar,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LessonContext } from '../context/LessonContext';
import { useAuth } from '../hooks/useAuth';

// Import SVG icons
import energyIcon from '../assets/energy-icon.svg';
import wasteIcon from '../assets/waste-icon.svg';
import housingIcon from '../assets/housing-icon.svg';
import waterIcon from '../assets/water-icon.svg';

const Lessons = () => {
  const { lessons } = useContext(LessonContext);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  // Get unique categories and difficulties for filters
  const categories = [...new Set(lessons.map(lesson => lesson.category))];
  const difficulties = [...new Set(lessons.map(lesson => lesson.difficulty))];

  // Filter lessons based on search term and filters
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || lesson.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === '' || lesson.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Sustainable Living Lessons
      </Typography>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Lessons"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                label="Difficulty"
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <MenuItem value="">All Difficulties</MenuItem>
                {difficulties.map(difficulty => (
                  <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Lessons Grid */}
      {filteredLessons.length > 0 ? (
        <Grid container spacing={4}>
          {filteredLessons.map((lesson) => (
            <Grid item key={lesson.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="div"
                    sx={{ height: 140, bgcolor: 'primary.light' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Avatar 
                      src={
                        lesson.category === 'Energy' ? energyIcon :
                        lesson.category === 'Waste' ? wasteIcon :
                        lesson.category === 'Housing' ? housingIcon :
                        lesson.category === 'Water' ? waterIcon :
                        null
                      } 
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <Chip 
                        label={lesson.category}
                        size="small"
                        sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}
                      />
                    </Box>
                  </Box>
                </Box>
                
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
                  
                  {/* Show progress if user is logged in */}
                  {user && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress:
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.floor(Math.random() * 100)} // Mock progress
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" component={RouterLink} to={`/lessons/${lesson.id}`}>
                    Start Lesson
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">
            No lessons found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Lessons;
