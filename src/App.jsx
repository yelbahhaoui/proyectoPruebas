import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Anime from './pages/Anime';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Games from './pages/Games';
import Forum from './pages/Forum';
import Details from './pages/Details';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import Chat from './pages/Chat';
import PublicProfile from './pages/PublicProfile';
import Notifications from './pages/Notifications';

import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>

        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col">

          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/games" element={<Games />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/movie/:id" element={<Details type="movie" />} />
              <Route path="/series/:id" element={<Details type="series" />} />
              <Route path="/game/:id" element={<Details type="game" />} />
              <Route path="/anime/:id" element={<Details type="anime" />} />

              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />

              <Route path="/forum" element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              } />

              <Route path="/forum/post/:postId" element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/user/:uid" element={<PublicProfile />} />

              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />

            </Routes>
          </main>

          <Footer />
          <ScrollToTop />

        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;