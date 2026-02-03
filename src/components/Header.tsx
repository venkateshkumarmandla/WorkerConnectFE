import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/api';
import { Globe, LogOut, Menu, X, ChevronDown, Building2, HardHat, ShieldCheck, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import APSymbol from '../Images/APSymbol.png';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  const handleLogout = async () => {
    const userRole = user?.type;
    let logoutMsg = t('navigation.logoutSuccess') || "Logout successful";

    if (userRole === 'worker') logoutMsg = "Worker Logout Success";
    else if (userRole === 'establishment') logoutMsg = "Establishment Logout Success";
    else if (userRole === 'department') logoutMsg = "Department Logout Success";

    try {
      const response: any = await logoutUser();
      const msg = response?.attendanceMessage || logoutMsg;
      logout();
      // toast.success(msg);
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      logout();
      // toast.success(logoutMsg);
      navigate('/');
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const dropdownItems = [
    { label: t('auth.citizenLogin'), to: '/login/worker', icon: HardHat },
    { label: t('landing.loginAsEstablishment'), to: '/login/establishment', icon: Building2 },
    { label: t('auth.employeeLogin'), to: '/login/department', icon: ShieldCheck },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-100 safe-top sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo & Portal Title */}
          <Link
            to={
              user?.type === 'worker' ? '/dashboard/worker' :
                user?.type === 'establishment' ? '/dashboard/establishment' :
                  user?.type === 'department' ? '/dashboard/department' : '/'
            }
            className="flex items-center gap-3 flex-shrink-0 group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-300" aria-label={t('leaders.logoAltText')}>
              <img src={APSymbol} alt="AP Symbol" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 text-xl md:text-2xl leading-tight tracking-tight">
                AP Worker Connect
              </span>
              <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
                {t('navigation.constructionSector')}
              </span>
            </div>
          </Link>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-500" />
              <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {!user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-orange-300 border border-orange-700 font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>{t('navigation.login')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    {dropdownItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.to}
                        onClick={() => setLoginDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-orange-600" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md border border-red-200 font-semibold text-sm transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('navigation.logout')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-inner animate-in slide-in-from-top duration-300">
          <div className="p-4 space-y-3">
            <nav className="space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-900 active:bg-gray-50 rounded-md">
                {t('navigation.home')}
              </Link>
              <Link to="/reports" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600">
                {t('navigation.reportsNav')}
              </Link>
              <Link to="/downloads" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600">
                {t('navigation.downloads')}
              </Link>
              <Link to="/mobile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600">
                {t('mobile.downloadApp')}
              </Link>
            </nav>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <button
                onClick={handleLanguageToggle}
                className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg text-gray-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span>Language / భాష</span>
                </div>
                <span className="text-orange-600">{language === 'en' ? 'తెలుగు' : 'English'}</span>
              </button>

              {!user ? (
                <div className="grid grid-cols-1 gap-2">
                  <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.signIn')}</p>
                  {dropdownItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg text-gray-700 font-semibold transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-orange-600" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 justify-center w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-bold border border-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('navigation.logout')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
