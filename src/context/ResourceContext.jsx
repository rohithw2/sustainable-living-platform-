import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const { user, logActivity } = useContext(AuthContext);

  const initialResources = [
    {
      id: 1,
      title: 'Comprehensive Guide to Renewable Energy',
      description: 'Overview of renewable energy technologies and policies by the U.S. DOE.',
      type: 'Article',
      category: 'Energy',
      url: 'https://www.energy.gov/eere/renewable-energy',
    },
    {
      id: 2,
      title: 'Zero Waste Home',
      description: 'Practical tips and lifestyle guidance for reducing household waste.',
      type: 'Article',
      category: 'Waste',
      url: 'https://zerowastehome.com/',
    },
    {
      id: 3,
      title: 'EPA WaterSense Program',
      description: 'Resources for water-efficient products and conservation strategies.',
      type: 'Program',
      category: 'Water',
      url: 'https://www.epa.gov/watersense',
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('resources');
    if (saved) {
      setResources(JSON.parse(saved));
    } else {
      setResources(initialResources);
      localStorage.setItem('resources', JSON.stringify(initialResources));
    }
  }, []);

  const persist = (next) => {
    setResources(next);
    localStorage.setItem('resources', JSON.stringify(next));
  };

  const addResource = (data) => {
    const nextId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
    const resource = { id: nextId, ...data };
    const next = [resource, ...resources];
    persist(next);
    try {
      logActivity && logActivity('RESOURCE_ADD', { userId: user?.id, resourceId: resource.id });
    } catch (_) {}
    return resource;
  };

  const updateResource = (id, updates) => {
    const next = resources.map(r => (r.id === id ? { ...r, ...updates } : r));
    persist(next);
    try {
      logActivity && logActivity('RESOURCE_UPDATE', { userId: user?.id, resourceId: id });
    } catch (_) {}
  };

  const deleteResource = (id) => {
    const next = resources.filter(r => r.id !== id);
    persist(next);
    try {
      logActivity && logActivity('RESOURCE_DELETE', { userId: user?.id, resourceId: id });
    } catch (_) {}
  };

  return (
    <ResourceContext.Provider value={{ resources, addResource, updateResource, deleteResource }}>
      {children}
    </ResourceContext.Provider>
  );
};

