import { useContext, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { ResourceContext } from '../context/ResourceContext';

const Resources = () => {
  const { resources } = useContext(ResourceContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const types = [...new Set(resources.map(r => r.type))];
  const categories = [...new Set(resources.map(r => r.category))];

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === '' || r.type === typeFilter;
    const matchesCategory = categoryFilter === '' || r.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Sustainability Resources
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Search Resources" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select labelId="type-label" value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {types.map(t => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select labelId="category-label" value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {categories.map(c => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>{r.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{r.description}</Typography>
                <Typography variant="caption" color="text.secondary">{r.type} • {r.category}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" href={r.url} target="_blank" rel="noopener noreferrer">Open Resource</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Resources;

