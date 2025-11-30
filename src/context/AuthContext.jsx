import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    // Load users and current user from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    // Seed defaults if empty
    if (savedUsers.length === 0) {
      const seeded = [
        { id: 'admin-1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { id: 'user-1', name: 'Regular User', email: 'user@example.com', password: 'password123', role: 'user' }
      ];
      localStorage.setItem('users', JSON.stringify(seeded));
      setUsers(seeded);
    } else {
      setUsers(savedUsers);
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load activity log
    const savedLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    setActivityLog(savedLog);
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginWithCredentials = (email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const found = savedUsers.find(u => u.email === email && u.password === password);
    if (!found) {
      logActivity('LOGIN_FAILURE', { email });
      return { ok: false, error: 'Incorrect email or password' };
    }
    const loggedUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    login(loggedUser);
    logActivity('LOGIN_SUCCESS', { userId: found.id, email: found.email });
    return { ok: true };
  };

  const register = (name, email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (savedUsers.some(u => u.email === email)) {
      return { ok: false, error: 'Email already registered' };
    }
    const newUser = { id: `user-${Date.now()}`, name, email, password, role: 'user' };
    const updated = [...savedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updated));
    setUsers(updated);
    // Auto-login after registration
    const loggedUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    login(loggedUser);
    logActivity('REGISTER', { userId: newUser.id, email: newUser.email });
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Activity logging helper
  const logActivity = (type, payload = {}) => {
    const entry = {
      id: `act-${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      ...payload,
    };
    const next = [entry, ...activityLog].slice(0, 500); // cap log size
    setActivityLog(next);
    localStorage.setItem('activityLog', JSON.stringify(next));
  };

  return (
    <AuthContext.Provider value={{ user, users, activityLog, login, loginWithCredentials, register, logout, isAdmin, loading, logActivity }}>
      {children}
    </AuthContext.Provider>
  );
};
