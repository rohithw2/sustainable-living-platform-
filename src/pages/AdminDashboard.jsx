import { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { LessonContext } from '../context/LessonContext';
import { ResourceContext } from '../context/ResourceContext';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { lessons, addLesson, updateLesson, deleteLesson, getLessonProgress, getOverallProgress } = useContext(LessonContext);
  const { resources, addResource, updateResource, deleteResource } = useContext(ResourceContext);
  const { user, isAdmin, users, activityLog } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    difficulty: 'Beginner',
    duration: '30 minutes',
    category: 'Energy',
    imageUrl: 'https://source.unsplash.com/random/300x200/?sustainability'
  });

  // Resource management state
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    description: '',
    type: 'Article',
    category: 'Energy',
    url: ''
  });

  // Redirect if not admin
  if (!user || !isAdmin()) {
    return <Navigate to="/login" />;
  }

  const handleOpenDialog = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        difficulty: lesson.difficulty,
        duration: lesson.duration,
        category: lesson.category,
        imageUrl: lesson.imageUrl
      });
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        difficulty: 'Beginner',
        duration: '30 minutes',
        category: 'Energy',
        imageUrl: 'https://source.unsplash.com/random/300x200/?sustainability'
      });
    }
    setOpenDialog(true);
  };

  // Resource handlers
  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setResourceFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceOpen = () => {
    setEditingResource(null);
    setResourceFormData({ title: '', description: '', type: 'Article', category: 'Energy', url: '' });
    setOpenResourceDialog(true);
  };

  const handleResourceEdit = (resource) => {
    setEditingResource(resource);
    setResourceFormData({ title: resource.title, description: resource.description, type: resource.type, category: resource.category, url: resource.url });
    setOpenResourceDialog(true);
  };

  const handleResourceDelete = (id) => {
    deleteResource(id);
  };

  const handleResourceClose = () => {
    setOpenResourceDialog(false);
  };

  const handleResourceSave = () => {
    if (editingResource) {
      updateResource(editingResource.id, resourceFormData);
    } else {
      addResource(resourceFormData);
    }
    setOpenResourceDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (editingLesson) {
      updateLesson(editingLesson.id, formData);
    } else {
      addLesson(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      deleteLesson(id);
    }
  };

  // Analytics data for charts
  const chartData = {
    labels: ['Energy', 'Waste', 'Housing', 'Water', 'Transportation'],
    datasets: [
      {
        label: 'Lessons by Category',
        data: [
          lessons.filter(l => l.category === 'Energy').length,
          lessons.filter(l => l.category === 'Waste').length,
          lessons.filter(l => l.category === 'Housing').length,
          lessons.filter(l => l.category === 'Water').length,
          lessons.filter(l => l.category === 'Transportation').length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Lessons by Category',
      },
    },
  };

  // Activity metrics
  const totalUsers = users.length;
  const registrations = activityLog.filter(a => a.type === 'REGISTER').length;
  const loginSuccess = activityLog.filter(a => a.type === 'LOGIN_SUCCESS').length;
  const loginFailure = activityLog.filter(a => a.type === 'LOGIN_FAILURE').length;
  const lessonsCompleted = activityLog.filter(a => a.type === 'LESSON_COMPLETE').length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {/* Analytics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Lessons
              </Typography>
              <Typography variant="h3" color="primary">
                {lessons.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Beginner Lessons
              </Typography>
              <Typography variant="h3" color="secondary">
                {lessons.filter(l => l.difficulty === 'Beginner').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advanced Lessons
              </Typography>
              <Typography variant="h3" color="error">
                {lessons.filter(l => l.difficulty === 'Advanced').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registrations
              </Typography>
              <Typography variant="h4" color="success.main">
                {registrations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Login Success
              </Typography>
              <Typography variant="h4" color="primary">
                {loginSuccess}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Login Failure
              </Typography>
              <Typography variant="h4" color="error">
                {loginFailure}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lessons Completed
              </Typography>
              <Typography variant="h4" color="secondary">
                {lessonsCompleted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress (current user)
              </Typography>
              <Typography variant="h3" color="success.main">
                {Math.round(getOverallProgress())}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Bar data={chartData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Admin Actions
            </Typography>
            <Typography variant="body2" paragraph>
              As an admin, you can manage lessons, track user engagement, and update sustainability content.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleOpenDialog()}
              sx={{ mb: 2 }}
            >
              Add New Lesson
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Recent User Activity
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityLog.slice(0, 20).map((a) => (
              <TableRow key={a.id}>
                <TableCell>{new Date(a.timestamp).toLocaleString()}</TableCell>
                <TableCell>{a.type}</TableCell>
                <TableCell>{a.email || a.userId || '-'}</TableCell>
                <TableCell>
                  {a.type === 'PROGRESS_UPDATE' && `Lesson ${a.lessonId} → ${a.progress}%`}
                  {a.type === 'LESSON_COMPLETE' && `Lesson ${a.lessonId} completed`}
                  {a.type === 'LOGIN_SUCCESS' && 'Login successful'}
                  {a.type === 'LOGIN_FAILURE' && 'Login failed'}
                  {a.type === 'REGISTER' && 'Registered'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Lessons Management */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Manage Lessons
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.id}</TableCell>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.category}</TableCell>
                <TableCell>{lesson.difficulty}</TableCell>
                <TableCell>{lesson.duration}</TableCell>
                <TableCell>{getLessonProgress(lesson.id)}%</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    onClick={() => handleOpenDialog(lesson)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(lesson.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Resources Management */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Manage Resources
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button 
          variant="contained" 
          onClick={() => {
            setEditingResource(null);
            setResourceFormData({ title: '', description: '', type: 'Article', category: 'Energy', url: '' });
            setOpenResourceDialog(true);
          }}
        >
          Add Resource
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell>
                  <Button size="small" href={r.url} target="_blank" rel="noopener noreferrer">Open</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleResourceEdit(r)} sx={{ mr: 1 }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleResourceDelete(r.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Add/Edit Resource Dialog */}
      <Dialog open={openResourceDialog} onClose={handleResourceClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingResource ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={resourceFormData.title}
              onChange={handleResourceChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={2}
              value={resourceFormData.description}
              onChange={handleResourceChange}
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={resourceFormData.type}
                    label="Type"
                    onChange={handleResourceChange}
                  >
                    <MenuItem value="Article">Article</MenuItem>
                    <MenuItem value="Video">Video</MenuItem>
                    <MenuItem value="Program">Program</MenuItem>
                    <MenuItem value="Guide">Guide</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={resourceFormData.category}
                    label="Category"
                    onChange={handleResourceChange}
                  >
                    <MenuItem value="Energy">Energy</MenuItem>
                    <MenuItem value="Waste">Waste</MenuItem>
                    <MenuItem value="Housing">Housing</MenuItem>
                    <MenuItem value="Water">Water</MenuItem>
                    <MenuItem value="Transportation">Transportation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="URL"
                  name="url"
                  value={resourceFormData.url}
                  onChange={handleResourceChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResourceClose}>Cancel</Button>
          <Button onClick={handleResourceSave} variant="contained" color="primary">
            {editingResource ? 'Update' : 'Add'} Resource
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Lesson Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Content"
              name="content"
              multiline
              rows={4}
              value={formData.content}
              onChange={handleChange}
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    name="difficulty"
                    value={formData.difficulty}
                    label="Difficulty"
                    onChange={handleChange}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    <MenuItem value="Energy">Energy</MenuItem>
                    <MenuItem value="Waste">Waste</MenuItem>
                    <MenuItem value="Housing">Housing</MenuItem>
                    <MenuItem value="Water">Water</MenuItem>
                    <MenuItem value="Transportation">Transportation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingLesson ? 'Update' : 'Add'} Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
