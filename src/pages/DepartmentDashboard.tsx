import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, MapPin, Building2, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LocationMap from '../components/LocationMap';
import LastLoggedIn from './LastloggedIn';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { departmentApi, DepartmentStats, EstablishmentSummary } from '../api/department';
import { DUMMY_DEPARTMENT_STATS, DUMMY_ESTABLISHMENTS } from '../api/dummyData';
import WorkerPresentCount from '../components/WorkerPresentCount';

const DepartmentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'stats' | 'map'>('stats');

  // Dynamic Data State
  const [stats, setStats] = useState<DepartmentStats | null>(DUMMY_DEPARTMENT_STATS);
  const [establishments, setEstablishments] = useState<EstablishmentSummary[]>(DUMMY_ESTABLISHMENTS);
  const [loading, setLoading] = useState(false);
  const [showAllEstablishments, setShowAllEstablishments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats and establishments concurrently
        const [statsData, estData] = await Promise.all([
          departmentApi.getStats(),
          departmentApi.getEstablishments()
        ]);
        setStats(statsData);
        setEstablishments(estData);
      } catch (error) {
        console.error("Failed to fetch department dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Optional: Poll for updates every 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="card-mobile">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value?.toLocaleString() ?? '...'}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              👥 <span className="text-blue-600 font-extrabold">{(user as any)?.name || (user as any)?.fullName || (user as any)?.firstName || 'Gowtham'}</span>
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of all establishments and workers
            </p>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-6 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <WorkerPresentCount count={establishments.reduce((acc, est) => acc + (est.presentNow || 0), 0)} />
            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
            <LastLoggedIn
              time={user?.lastLoggedIn || new Date().toISOString()}
              formatStr="dd MMM yyyy, hh:mm a"
            />
          </div>
        </div>

        {/* Attendance Status Prompts */}
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center text-blue-600 space-x-2 animate-pulse bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">⏳ Loading attendance data…</span>
            </div>
          ) : establishments.length > 0 ? (
            <div className="flex items-center text-green-700 space-x-2 bg-green-50 p-3 rounded-lg border border-green-100">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">✅ Attendance data loaded successfully.</span>
            </div>
          ) : (
            <div className="flex items-center text-orange-700 space-x-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">ℹ️ No attendance data found for this period.</span>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2 bg-white rounded-lg p-1 w-fit shadow-sm">
            <button
              onClick={() => setSelectedView('stats')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === 'stats'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('map')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === 'map'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              <MapPin className="h-4 w-4 mr-1 inline" />
              Map View
            </button>
          </div>
        </div>

        {selectedView === 'stats' ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
              <StatCard
                icon={Users}
                title={t('department.totalWorkers')}
                value={establishments.reduce((acc, est) => acc + (est.totalWorkers || 0), 0)}
                color="text-blue-600"
              />
              <StatCard
                icon={UserCheck}
                title={t('department.workersPresent')}
                value={establishments.reduce((acc, est) => acc + (est.presentNow || 0), 0)}
                color="text-emerald-600"
              />
              <StatCard
                icon={UserX}
                title={t('department.workersAbsent')}
                value={establishments.reduce((acc, est) => acc + ((est.totalWorkers || 0) - (est.presentNow || 0)), 0)}
                color="text-red-600"
              />
            </div>

            {/* Live Activity & Establishment List */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Establishment List (Expanded) */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{t('department.establishmentStats')}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {t('common.online')}
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3">{t('establishment.establishment')}</th>
                          <th className="px-4 py-3 text-center">{t('establishment.totalWorkers')}</th>
                          <th className="px-4 py-3 text-center">{t('department.present')}</th>
                          <th className="px-4 py-3">Recent Check-ins</th>
                          <th className="px-4 py-3">Recent Check-outs</th>
                          <th className="px-4 py-3">{t('common.view')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {establishments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                              {loading ? 'Loading establishments...' : 'No establishments found.'}
                            </td>
                          </tr>
                        ) : (
                          (showAllEstablishments ? establishments : establishments.slice(0, 4)).map((est) => (
                            <tr key={est.establishmentId} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {est.name}
                                <div className="text-xs text-gray-500">{est.location}</div>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-600 font-semibold">{est.totalWorkers}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600 font-bold">{est.presentNow}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-[10px] max-w-[200px] truncate">
                                {est.checkedInList.length > 0
                                  ? est.checkedInList.map(w => `${w.fullName} (${w.checkInTime})`).join(', ')
                                  : <span className="text-gray-400">—</span>
                                }
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-[10px] max-w-[200px] truncate">
                                {est.checkedOutList.length > 0
                                  ? est.checkedOutList.map(w => `${w.fullName} (${w.checkOutTime})`).join(', ')
                                  : <span className="text-gray-400">—</span>
                                }
                              </td>
                              <td className="px-4 py-3">
                                <Link to={`/establishment/${est.establishmentId}`} state={{ establishment: est }} className="text-blue-600 hover:text-blue-800" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {establishments.length > 4 && (
                    <div className="p-4 border-t border-gray-100 text-center">
                      <button
                        onClick={() => setShowAllEstablishments(!showAllEstablishments)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        {showAllEstablishments ? "Show Less" : `Show ${establishments.length - 4} More Establishments`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Location Map View */
          <div className="mb-8">
            <LocationMap
              locations={establishments.map(est => ({
                id: est.establishmentId.toString(),
                name: est.name,
                type: 'establishment',
                status: 'online',
                latitude: 17.3850 + (est.establishmentId * 0.01),
                longitude: 78.4867 + (est.establishmentId * 0.01)
              }))}
              center={{ latitude: 17.3850, longitude: 78.4867 }}
              zoom={10}
              height="600px"
              showControls={true}
              onLocationClick={(loc) => navigate(`/establishment/${loc.id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;
