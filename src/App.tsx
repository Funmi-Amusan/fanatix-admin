import './globals.css';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
const UsersList = lazy(() => import('./pages/UsersList'));
const UserDetails = lazy(() => import('./pages/UserDetails'));
const FixtureDetails = lazy(() => import('./pages/FixtureDetails'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./components/404'));


import RedirectRoot from './RedirectRoutes';
import SidebarLayout from './components/layout/SidebarLayout';
const FixturesList = lazy(() => import('@/pages/FixturesList'));
const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="p-6 text-center">Loading page...</div>}>
 <Routes>
  <Route path="/" element={<RedirectRoot />} />
  <Route path="/login" element={<Login />} />
  {/* <Route element={<ProtectedRoute />}> */}
    <Route element={<SidebarLayout />}>
      <Route path="/users" element={<UsersList />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/fixtures" element={<FixturesList />} />
      <Route path="/fixtures/:id" element={<FixtureDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Route>
  {/* </Route> */}
  <Route path="*" element={<NotFound />} />
</Routes>
      </Suspense>
  </QueryClientProvider>
  );
}

export default App;
