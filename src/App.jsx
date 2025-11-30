import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LessonProvider } from './context/LessonContext';
import { ResourceProvider } from './context/ResourceContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { CssBaseline } from '@mui/material';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Resources from './pages/Resources';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LessonProvider>
          <ResourceProvider>
            <CssBaseline />
            <Router basename="/sustainable-living-platform-">
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/lessons" element={<Lessons />} />
                  <Route path="/lessons/:id" element={<LessonDetail />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Home />} />
                </Routes>
              </Layout>
            </Router>
          </ResourceProvider>
        </LessonProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
