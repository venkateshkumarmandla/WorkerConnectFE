import React, { useState, useEffect } from 'react';
import { Building2, Users, UserCheck, UserX, Calendar, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import LastLoggedIn from './LastloggedIn';
import { establishmentApi, WorkerSummary, EstablishmentDashboardData } from '../api/establishment';
import WorkerPresentCount from '../components/WorkerPresentCount';

const EstablishmentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationState = useLocation();
  const [establishmentDetails] = useState<any>(locationState.state?.establishment || null);
  const establishmentId = id ? parseInt(id) : undefined;
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  // Default to yesterday if no last login
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(10, 0, 0, 0);

  const [dashboardData, setDashboardData] = useState<EstablishmentDashboardData | null>(null);
  const [workers, setWorkers] = useState<WorkerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard data (workers + stats)
        const data = await establishmentApi.getDashboardData(establishmentId);
        setDashboardData(data);
        setWorkers(data.workers);
      } catch (error) {
        console.error("Failed to fetch establishment dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.type === "establishment" || user?.type === "department") {
      fetchData();

      // Poll mostly for status updates if not using websockets
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, establishmentId]);

  // Get unique locations from workers
  const locations = Array.from(new Set(workers.map(w => w.siteLocation).filter(Boolean)));

  const StatCard = ({ icon: Icon, title, value, color, link }: any) => (
    <Link to={link || '#'} className="card-mobile hover:shadow-xl transition-shadow group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value ?? '...'}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
        </div>
      </div>
    </Link>
  );

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return null;
    // If it's already in 12hr format (contains AM/PM), return as is
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;

    // Otherwise try to parse as date
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr; // Fallback to original string
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back') || 'Back'}
          </button> */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4 mb-2">
              <div className="flex-shrink-0">
                {user?.type === 'establishment' && !establishmentId && user.logoUrl ? (
                  <img
                    src={user.logoUrl}
                    alt="Establishment Logo"
                    className="h-16 w-16 object-contain rounded-lg border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="h-16 w-16 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 border border-orange-200">
                    <Building2 className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {establishmentDetails?.name || (establishmentId ? `Establishment Dashboard` : t('dashboard.welcomeEstSuccess').replace('{0}', (user as any)?.establishmentName || 'Establishment'))}
                </h1>
                <p className="text-gray-600 font-medium">
                  {establishmentDetails?.location || t('dashboard.todaySubtext')}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
              <WorkerPresentCount count={dashboardData?.presentNow ?? null} />
              {!establishmentId && <LastLoggedIn time={user?.lastLoggedIn || yesterday.toISOString()} />}
            </div>
          </div>
        </div>

        {/* Logo Missing Prompt */}
        {/* {user?.type === 'establishment' && !user.logoUrl && (
          <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm flex items-start animate-pulse">
            <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800 font-semibold">
                {t('dashboard.welcomeEstMissing')}
              </p>
              <Link to="/profile/establishment" className="text-sm text-orange-600 hover:text-orange-700 font-bold underline mt-1 block">
                {t('worker.viewProfile')} →
              </Link>
            </div>
          </div>
        )} */}

        {/* Attendance Status Prompts */}
        {/* <div className="mb-6">
          {loading ? (
            <div className="flex items-center text-blue-600 space-x-2 animate-pulse bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">⏳ Loading attendance data…</span>
            </div>
          ) : workers.length > 0 ? (
            <div className="flex items-center text-green-700 space-x-2 bg-green-50 p-3 rounded-lg border border-green-100">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">📈 Attendance data loaded for all workers.</span>
            </div>
          ) : (
            <div className="flex items-center text-orange-700 space-x-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">ℹ️ No worker attendance found for this period.</span>
            </div>
          )}
        </div> */}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            icon={Users}
            title={t('establishment.totalWorkers')}
            value={dashboardData?.totalWorkers}
            color="text-blue-600"
            link="/workers/management"
          />
          <StatCard
            icon={UserCheck}
            title={t('department.workersPresent')}
            value={dashboardData?.presentNow}
            color="text-emerald-600"
          />
          <StatCard
            icon={UserX}
            title={t('department.workersAbsent')}
            value={dashboardData?.totalWorkers ? (dashboardData.totalWorkers - (dashboardData.presentNow || 0)) : 0}
            color="text-red-600"
          />
          <StatCard
            icon={CheckCircle}
            title={t('establishment.avgAttendance')}
            value={dashboardData?.totalCheckIns}
            color="text-orange-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/workers/management" className="card-mobile hover:shadow-xl transition-shadow group">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t('establishment.workerManagement')}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {t('establishment.manageWorkers')}
            </p>
            <div className="text-blue-600 group-hover:text-blue-700 text-sm font-medium">
              {t('common.view')} →
            </div>
          </Link>

          <Link to="/attendance/reports" className="card-mobile hover:shadow-xl transition-shadow group">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">{t('establishment.attendanceReport')}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {t('establishment.viewAttendanceReports')}
            </p>
            <div className="text-green-600 group-hover:text-green-700 text-sm font-medium">
              {t('common.view')} →
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Right Column: Worker List (Expanded) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assigned Workers Overview
                </h3>
                <div className="flex items-center">
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="mr-2 px-3 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((loc, idx) => (
                      <option key={idx} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">{t('worker.fullName')}</th>
                      <th className="px-4 py-3">{t('worker.siteLocation')}</th>
                      <th className="px-4 py-3">{t('worker.checkIn')}</th>
                      <th className="px-4 py-3">{t('worker.checkOut')}</th>
                      <th className="px-4 py-3">{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading workers...</td></tr>
                    ) : workers.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No workers assigned to this establishment.</td></tr>
                    ) : (
                      workers
                        .filter(w => w.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                        .filter(w => locationFilter === 'all' || w.siteLocation === locationFilter)
                        .slice(0, visibleCount)
                        .map((worker: WorkerSummary) => (
                          <tr key={worker.workerId} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{worker.fullName}</td>
                            <td className="px-4 py-3 text-gray-600">{worker.siteLocation}</td>
                            <td className="px-4 py-3 text-gray-600">
                              <div className="flex flex-col">
                                <span>{formatTime(worker.checkInTime) || <span className="text-gray-400">—</span>}</span>
                                {worker.checkInTime && worker.gate && (
                                  <span className="text-xs text-gray-500">{worker.gate}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              <div className="flex flex-col">
                                <span>{formatTime(worker.checkOutTime) || <span className="text-gray-400">—</span>}</span>
                                {worker.checkOutTime && worker.gate && (
                                  <span className="text-xs text-gray-500">{worker.gate}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${worker.status === 'Present'
                                ? 'bg-green-100 text-green-800'
                                : worker.status === 'Checked Out'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                                }`}>
                                {worker.status === 'Present' ? t('common.present') :
                                  worker.status === 'Checked Out' ? t('common.checkedOut') :
                                    t('common.absent')}
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && workers.length > visibleCount && (
                <div className="p-4 border-t border-gray-200 text-center bg-gray-50">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    View More Workers ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
