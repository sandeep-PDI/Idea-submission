import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { LightbulbIcon, ClipboardListIcon, ShieldIcon, LogOutIcon } from 'lucide-react';

function Layout() {
  const { oktaAuth, authState } = useOktaAuth();
  const navigate = useNavigate();

  if (!authState) return null;

  const handleLogout = async () => {
    await oktaAuth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <LightbulbIcon className="h-8 w-8" />
                <span className="font-bold text-xl">PDI Ideas</span>
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/submit"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  Submit Idea
                </Link>
                {authState.isAuthenticated && (
                  <>
                    <Link
                      to="/review"
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                    >
                      <ClipboardListIcon className="inline-block h-4 w-4 mr-1" />
                      Review
                    </Link>
                    {authState.idToken?.claims.groups?.includes('admin') && (
                      <Link
                        to="/admin"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                      >
                        <ShieldIcon className="inline-block h-4 w-4 mr-1" />
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {authState.isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  <LogOutIcon className="h-4 w-4 mr-1" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} PDI Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;