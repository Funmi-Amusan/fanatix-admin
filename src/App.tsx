import './globals.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/404';
import UsersList from './components/Users/UsersList';
import UserDetails from './components/Users/UserDetails';
import FixturesList from './components/Fixtures/FixturesList';
import FixtureDetails from './components/Fixtures/FixtureDetails';
import SidebarLayout from './components/layout/SidebarLayout';

function App() {
  return (
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
  );
}

export default App;
