import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import SidebarLayout from './components/SidebarLayout';
import FestivalBanner from './components/FestivalBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Profile from './pages/Profile';
import TagPage from './pages/TagPage';
import Tags from './pages/Tags';
import Bookmarks from './pages/Bookmarks';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import Friends from './pages/Friends';
import Chat from './pages/Chat';
import GamificationDashboard from './pages/GamificationDashboard';
import ForYou from './pages/ForYou';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 8px 24px var(--shadow-lg)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--color-primary)',
                    secondary: 'var(--text-inverse)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--color-error)',
                    secondary: 'var(--text-inverse)',
                  },
                },
              }}
            />
            <Navbar />
            <FestivalBanner />
            <SidebarLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/ask" element={<AskQuestion />} />
                <Route path="/questions/:id" element={<QuestionDetail />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/tags/:name" element={<TagPage />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/messages/:friendId" element={<Chat />} />
                <Route path="/progress" element={<GamificationDashboard />} />
                <Route path="/for-you" element={<ForYou />} />
              </Routes>
            </SidebarLayout>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
