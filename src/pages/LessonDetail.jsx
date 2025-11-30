import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider, 
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LessonContext } from '../context/LessonContext';
import { useAuth } from '../hooks/useAuth';

const LessonDetail = () => {
  const { id } = useParams();
  const { lessons, updateProgress, getLessonProgress } = useContext(LessonContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const foundLesson = lessons.find(l => l.id === parseInt(id));
    if (foundLesson) {
      setLesson(foundLesson);
      if (user) {
        const savedProgress = getLessonProgress(parseInt(id));
        setProgress(savedProgress);
      }
    }
  }, [id, lessons, user, getLessonProgress]);

  const handleProgressUpdate = (newProgress) => {
    if (user) {
      setProgress(newProgress);
      updateProgress(parseInt(id), newProgress);
    }
  };

  const handleComplete = () => {
    handleProgressUpdate(100);
  };

  if (!lesson) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Lesson not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/lessons')}
          sx={{ mt: 2 }}
        >
          Back to Lessons
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/lessons')}
        sx={{ mb: 2 }}
      >
        Back to Lessons
      </Button>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {lesson.title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CategoryIcon />} 
            label={lesson.category} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<SchoolIcon />} 
            label={lesson.difficulty} 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            icon={<AccessTimeIcon />} 
            label={lesson.duration} 
            variant="outlined" 
          />
        </Box>

        {lesson.videoUrl && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lesson Video
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3
              }}
            >
              <Box
                component="iframe"
                src={lesson.videoUrl}
                title={`${lesson.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
              />
            </Box>
          </Box>
        )}
        
        {user && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Your Progress:</Typography>
              <Typography variant="body2">{progress}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {lesson.description}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Lesson Content
          </Typography>
          <Typography variant="body1" paragraph>
            {lesson.content}
          </Typography>
          
          {/* Additional mock content to make the lesson look more complete */}
          <Typography variant="body1" paragraph>
            Sustainable living is a lifestyle that attempts to reduce an individual's or society's use of Earth's natural resources and personal resources. Practitioners of sustainable living often attempt to reduce their carbon footprint by altering methods of transportation, energy consumption, and diet.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Proponents of sustainable living aim to conduct their lives in ways that are consistent with sustainability, naturally balanced, and respectful of humanity's symbiotic relationship with the Earth's natural ecology. The practice and general philosophy of ecological living closely follows the overall principles of sustainable development.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Key Principles
          </Typography>
          
          <Typography variant="body1" component="div">
            <ul>
              <li>Reducing consumption of resources</li>
              <li>Using renewable energy sources</li>
              <li>Reducing waste and pollution</li>
              <li>Protecting natural ecosystems</li>
              <li>Ensuring that economic activities are environmentally sustainable</li>
            </ul>
          </Typography>
        </Box>
        
        {/* Related Resources */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Related Resources
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={4} key={item}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Resource {item}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Additional materials related to {lesson.title.toLowerCase()}.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {user && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {progress < 100 ? (
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleComplete}
              >
                Mark as Completed
              </Button>
            ) : (
              <Alert severity="success" sx={{ width: '100%' }}>
                You have completed this lesson!
              </Alert>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default LessonDetail;
