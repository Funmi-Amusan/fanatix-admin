import './globals.css';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/Home';
import Login from './pages/Login';
import NotFound from './components/404';
import SidebarLayout from './components/layout/SidebarLayout';
import UsersList from './pages/UsersList';
import UserDetails from './pages/UserDetails';
import FixturesList from './pages/FixturesList';
import FixtureDetails from './pages/FixtureDetails';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/fixtures" element={<FixturesList />} />
        <Route path="/fixtures/:id" element={<FixtureDetails />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </QueryClientProvider>
  );
}

export default App;
