import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../slices/authSlice";
import { Menu, X, LogOut, LayoutDashboard, Bookmark, Plus, Shield } from "lucide-react";

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/tools" className="text-2xl font-bold tracking-wide flex items-center gap-2" onClick={closeMenu}>
              AI.Discover
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/tools"
              className="hover:text-primary-foreground/80 transition-colors duration-200 font-medium"
            >
              Tools
            </Link>
            <Link
              to="/bookmarks"
              className="hover:text-primary-foreground/80 transition-colors duration-200 font-medium"
            >
              Bookmarks
            </Link>

            {/* Dashboard Link based on Role */}
            <Link
              to={
                user?.role === "startup"
                  ? "/creator/dashboard"
                  : user?.role === "admin"
                    ? "/admin"
                    : "/dashboard"
              }
              className="hover:text-primary-foreground/80 transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>

            {/* Startup-only: Create Tool */}
            {user?.role === "startup" && (
              <Link
                to="/tools/new"
                className="hover:text-primary-foreground/80 transition-colors duration-200 font-medium"
              >
                Create Tool
              </Link>
            )}

            {/* Admin-only Link */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="hover:text-primary-foreground/80 transition-colors duration-200 font-medium"
              >
                Admin Panel
              </Link>
            )}

            {/* Logout Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/tools"
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Tools
            </Link>
            <Link
              to="/bookmarks"
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors flex items-center gap-2"
            >
              <Bookmark size={18} /> Bookmarks
            </Link>

            <Link
              to={
                user?.role === "startup"
                  ? "/creator/dashboard"
                  : user?.role === "admin"
                    ? "/admin"
                    : "/dashboard"
              }
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>

            {user?.role === "startup" && (
              <Link
                to="/tools/new"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Create Tool
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors flex items-center gap-2"
              >
                <Shield size={18} /> Admin Panel
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors flex items-center gap-2 mt-4"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium bg-white text-primary hover:bg-gray-100 transition-colors mt-4 text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
