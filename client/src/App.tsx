import '@/globals.css';
import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useAppDispatch } from './store/store';
import { syncUsers } from './api/user';
import { Toaster } from './components/ui/toaster';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(syncUsers());
  }, [dispatch]);

  return (
    <div>
      <Outlet />
      <Toaster />
      <div id="toast-container" className="toast-container"></div>
    </div>
  );
}

export default App;
