import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LightbulbIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-customNav text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <LightbulbIcon className="h-8 w-8" />
                <span className="font-bold text-xl">PDI Ideas</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <NavLink to="/dashboard" current={location.pathname === '/dashboard'}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/submit" current={location.pathname === '/submit'}>
                    Submit Idea
                  </NavLink>
                  {(user.user.role === 'REVIEWER' || user.user.role === 'ADMIN') && (
                    <NavLink to="/review" current={location.pathname === '/review'}>
                      Review Ideas
                    </NavLink>
                  )}
                  {user.user.role === 'ADMIN' && (
                    <NavLink to="/admin" current={location.pathname === '/admin'}>
                      Admin Panel
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <div className="flex items-center">
                <span className="text-sm mr-4">
                  {user.name} ({user.department})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>© {new Date().getFullYear()} PDI Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children, current }: { to: string; children: React.ReactNode; current: boolean }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        current
          ? 'bg-indigo-700 text-white'
          : 'text-indigo-100 hover:bg-indigo-500 hover:text-white transition-colors'
      }`}
    >
      {children}
    </Link>
  );
}

export default Layout;