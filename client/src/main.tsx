import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/globals.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import Landing from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthenticationPage';
import EventsPage from '@/pages/EventsPage';
import UserProfile from './pages/UserProfile';
import EventsManage from './pages/EventsManage';

import store from '@/store/store';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEventsPage from './pages/CreateEventsPage';
import Layout from './components/Layout';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            {/* Public routes */}
            <Route path="/" index element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />} >
              <Route element={<Layout />}>
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/create" element={<CreateEventsPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<EventsManage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);