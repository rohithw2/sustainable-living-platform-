import { createContext, useState, useEffect, useContext } from 'react';
import energyBanner from '../assets/energy-banner.svg';
import wasteBanner from '../assets/waste-banner.svg';
import housingBanner from '../assets/housing-banner.svg';
import waterBanner from '../assets/water-banner.svg';
import transportationBanner from '../assets/transportation-banner.svg';
import { AuthContext } from './AuthContext';

export const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const { user, logActivity } = useContext(AuthContext);

  // Initial lessons data
  const initialLessons = [
    {
      id: 1,
      title: 'Introduction to Renewable Energy',
      description: 'Learn about different types of renewable energy sources and their benefits.',
      content: 'Renewable energy comes from sources that are naturally replenishing but flow-limited. They are virtually inexhaustible in duration but limited in the amount of energy that is available per unit of time. Renewable energy sources include biomass, hydropower, geothermal, wind, and solar.',
      difficulty: 'Beginner',
      duration: '30 minutes',
      imageUrl: energyBanner,
      videoUrl: 'https://www.youtube.com/embed/xKxrkht7CpY',
      category: 'Energy',
    },
    {
      id: 2,
      title: 'Waste Reduction Strategies',
      description: 'Practical ways to reduce waste in your daily life.',
      content: 'Waste reduction is the practice of using less material and energy to minimize waste generation and preserve natural resources. It includes strategies like recycling, composting, and using reusable products instead of disposable ones.',
      difficulty: 'Beginner',
      duration: '45 minutes',
      imageUrl: wasteBanner,
      videoUrl: 'https://www.youtube.com/embed/OasbYWF4_S8',
      category: 'Waste',
    },
    {
      id: 3,
      title: 'Sustainable Home Design',
      description: 'Principles of eco-friendly home design and renovation.',
      content: 'Sustainable home design focuses on increasing the efficiency of resource use — energy, water, and materials — while reducing building impacts on human health and the environment throughout the building lifecycle.',
      difficulty: 'Intermediate',
      duration: '60 minutes',
      imageUrl: housingBanner,
      videoUrl: 'https://www.youtube.com/embed/odbSgI7QL34',
      category: 'Housing',
    },
    {
      id: 4,
      title: 'Water Conservation Techniques',
      description: 'Learn how to reduce water usage and prevent water pollution.',
      content: 'Water conservation includes all the policies, strategies and activities to sustainably manage fresh water resources, to protect the environment, and to meet current and future human demand.',
      difficulty: 'Intermediate',
      duration: '45 minutes',
      imageUrl: waterBanner,
      videoUrl: 'https://www.youtube.com/embed/n5w3Gv2fTNM',
      category: 'Water',
    },
    {
      id: 5,
      title: 'Sustainable Transportation',
      description: 'Exploring eco-friendly transportation options and their impact.',
      content: 'Sustainable transportation refers to ways of transportation that are sustainable in terms of their social and environmental impacts. Components for evaluating sustainability include the particular vehicles used, the energy source, and the infrastructure used to accommodate the transport.',
      difficulty: 'Advanced',
      duration: '50 minutes',
      imageUrl: transportationBanner,
      videoUrl: 'https://www.youtube.com/embed/2u9Q7edgXZ0',
      category: 'Transportation',
    },
  ];

  useEffect(() => {
    // Load lessons from localStorage if available, else seed initial
    const savedLessons = localStorage.getItem('lessons');
    if (savedLessons) {
      try {
        const parsed = JSON.parse(savedLessons);
        setLessons(Array.isArray(parsed) ? parsed : initialLessons);
      } catch (_) {
        setLessons(initialLessons);
      }
    } else {
      setLessons(initialLessons);
      localStorage.setItem('lessons', JSON.stringify(initialLessons));
    }
    
    // Load user progress from localStorage if available
    if (user) {
      const savedProgress = localStorage.getItem(`progress_${user.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  const persistLessons = (next) => {
    setLessons(next);
    localStorage.setItem('lessons', JSON.stringify(next));
  };

  const updateLesson = (lessonId, updatedData) => {
    const next = lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, ...updatedData } : lesson
    );
    persistLessons(next);
    try { logActivity && logActivity('LESSON_UPDATE', { userId: user?.id, lessonId }); } catch (_) {}
  };

  const addLesson = (newLesson) => {
    const lesson = {
      ...newLesson,
      id: lessons.length > 0 ? Math.max(...lessons.map(l => l.id)) + 1 : 1
    };
    const next = [...lessons, lesson];
    persistLessons(next);
    try { logActivity && logActivity('LESSON_ADD', { userId: user?.id, lessonId: lesson.id }); } catch (_) {}
  };

  const deleteLesson = (lessonId) => {
    const next = lessons.filter(lesson => lesson.id !== lessonId);
    persistLessons(next);
    try { logActivity && logActivity('LESSON_DELETE', { userId: user?.id, lessonId }); } catch (_) {}
  };

  const updateProgress = (lessonId, progress) => {
    if (!user) return;
    
    const newProgress = {
      ...userProgress,
      [lessonId]: progress
    };
    
    setUserProgress(newProgress);
    localStorage.setItem(`progress_${user.id}`, JSON.stringify(newProgress));

    // Log activity
    try {
      logActivity && logActivity('PROGRESS_UPDATE', { userId: user.id, lessonId, progress });
      if (progress === 100) {
        logActivity && logActivity('LESSON_COMPLETE', { userId: user.id, lessonId });
      }
    } catch (_) {}
  };

  const getLessonProgress = (lessonId) => {
    return userProgress[lessonId] || 0;
  };

  const getOverallProgress = () => {
    if (!lessons.length) return 0;
    
    const completedLessons = Object.values(userProgress).filter(progress => progress === 100).length;
    return (completedLessons / lessons.length) * 100;
  };

  return (
    <LessonContext.Provider value={{
      lessons,
      updateLesson,
      addLesson,
      deleteLesson,
      updateProgress,
      getLessonProgress,
      getOverallProgress
    }}>
      {children}
    </LessonContext.Provider>
  );
};
