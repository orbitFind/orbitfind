import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/globals.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import Landing from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthenticationPage';
import EventsPage from '@/pages/EventsPage';

import store from '@/store/store';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEventsPage from './pages/CreateEventsPage';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            {/* Public routes */}
            <Route path="/" index element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />} >
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/create" element={<CreateEventsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)