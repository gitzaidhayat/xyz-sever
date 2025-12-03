import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import { loadUser } from './store/slices/authSlice';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Only load user from server if we don't have it in localStorage
    const authState = localStorage.getItem('authState');
    const hasAuthInStorage = authState && JSON.parse(authState).isAuthenticated;
    
    console.log('App mounted, auth in localStorage:', hasAuthInStorage);
    
    if (!hasAuthInStorage) {
      console.log('No auth in storage, calling loadUser...');
      const loadUserData = async () => {
        try {
          const result = await dispatch(loadUser()).unwrap();
          console.log('LoadUser success:', result);
        } catch (err) {
          console.log('LoadUser failed (user not logged in):', err);
        }
      };
      loadUserData();
    } else {
      console.log('Using auth from localStorage, skipping loadUser');
    }
  }, [dispatch]);

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

