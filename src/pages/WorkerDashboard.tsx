import React, { useState, useEffect } from 'react';
import { User, Calendar, Settings, Loader, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LastLoggedIn from './LastloggedIn';
import { checkInOrOut, CheckInOutPayload, getWorkerDashboardDetails, getWorkerAttendanceHistory } from '../api/api';
import { toast } from "react-hot-toast";

interface AttendanceRecord {
  id: string;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  checkInLocation?: { latitude: number; longitude: number };
  checkOutLocation?: { latitude: number; longitude: number };
  status: 'present' | 'absent' | 'partial';
}

const WorkerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState<string | null>(null);
  const [lastCheckOutTime, setLastCheckOutTime] = useState<string | null>(null);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentMonth] = useState(new Date());
  const [assignment, setAssignment] = useState<{ id: number; estmtWorkerId: number; name: string } | null>(null);


  const [realStats, setRealStats] = useState({
    present: 0,
    incomplete: 0,
    absent: 0,
    totalGrossHours: "0.00",
    totalEffectiveHours: "0.00",
    totalGrossHoursToday: "0.00",
    totalEffectiveHoursToday: "0.00"
  });

  // Timer state
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  // Update timer effect
  // Update timer effect
  useEffect(() => {
    let interval: any;
    if (isCheckedIn && lastCheckInTime) {
      interval = setInterval(() => {
        const start = new Date(lastCheckInTime).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        if (diff >= 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
    } else {
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, lastCheckInTime]);

  // Fetch real attendance data
  const fetchData = async () => {
    if (!user || user.type !== 'worker') return;

    try {
      const [detailsRes, historyRes]: [any, any] = await Promise.all([
        getWorkerDashboardDetails(),
        getWorkerAttendanceHistory(user.id)
      ]);

      const details = detailsRes?.data;
      const history = historyRes?.data;

      if (details) {
        setIsCheckedIn(details.attendance.status === 'checked-in');
        setLastCheckInTime(details.attendance.lastCheckIn);
        setLastCheckOutTime(details.attendance.lastCheckOut);

        if (details.establishment) {
          setAssignment({
            id: details.establishment.id,
            estmtWorkerId: details.establishment.estmtWorkerId,
            name: details.establishment.name
          });
        } else {
          setAssignment(null);
        }

        setRealStats(details.stats || {
          present: 0,
          incomplete: 0,
          absent: 0,
          totalGrossHours: "0.00",
          totalEffectiveHours: "0.00",
          totalGrossHoursToday: "0.00",
          totalEffectiveHoursToday: "0.00"
        });
      } else if (String(user.id) === '1') {
        // 🧪 UI Simulation Fallback for Worker ID 1
        console.log("🧪 Using Simulated Dummy Data for Worker ID 1");
        setIsCheckedIn(false);
        setLastCheckInTime(null);
        setLastCheckOutTime(null);
        setRealStats({
          present: 22,
          incomplete: 1,
          absent: 4,
          totalGrossHours: "176.50",
          totalEffectiveHours: "176.50",
          totalGrossHoursToday: "4.50",
          totalEffectiveHoursToday: "4.50"
        });
        setAssignment({
          id: 2,
          estmtWorkerId: 1001,
          name: "tekworks"
        });
      }

      if (history && Array.isArray(history) && history.length > 0) {
        const mappedHistory: AttendanceRecord[] = history.map(h => ({
          id: String(h.attendance_id),
          date: new Date(h.check_in_date_time),
          checkInTime: new Date(h.check_in_date_time),
          checkOutTime: h.check_out_date_time ? new Date(h.check_out_date_time) : undefined,
          status: h.check_out_date_time || h.status === 'o' ? 'present' : 'partial'
        }));
        setAttendanceRecords(mappedHistory);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCheckIn = async () => {
    if (user?.type !== "worker") return;

    try {
      setIsProcessing(true);
      const payload: CheckInOutPayload = {
        attendanceId: 0,
        establishmentId: assignment?.id || 0,
        workerId: user.id,
        estmtWorkerId: assignment?.estmtWorkerId || 0,
        workLocation: assignment?.name || "Assigned Location",
        checkInDateTime: new Date().toISOString(),
        checkOutDateTime: null,
        status: "i",
      };

      const response = await checkInOrOut(payload);
      setIsCheckedIn(true);
      toast.success(response.data.message || "Login successful");
      fetchData();
    } catch (error) {
      console.error("Check-in failed:", error);
      // toast.error("Check-in failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (user?.type !== "worker") return;

    try {
      setIsProcessing(true);
      const payload: CheckInOutPayload = {
        attendanceId: 0,
        establishmentId: assignment?.id || 0,
        workerId: user.id,
        estmtWorkerId: assignment?.estmtWorkerId || 0,
        workLocation: assignment?.name || "Assigned Location",
        checkOutDateTime: new Date().toISOString(),
        status: "o",
      };

      const response = await checkInOrOut(payload);
      setIsCheckedIn(false);
      toast.success(response.data.message || "Logout successful");
      fetchData();
    } catch (error) {
      console.error("Check-out failed:", error);
      toast.error("Check-out failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = realStats;

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-full text-white shadow-lg shadow-blue-100">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                {t('dashboard.welcomeWorker').replace('{0}', (user as any)?.fullName || (user as any)?.firstName || 'Worker')}
              </h1>
              <p className="text-gray-600 font-medium mt-0.5">
                {t('dashboard.todaySubtext')}
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <LastLoggedIn time={user?.lastLoggedIn} />
          </div>
        </div>

        {/* Today's Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-50 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Calendar size={120} className="text-indigo-600" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center z-10 relative">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            {t('common.todayStatus') || "Today's Activity"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-10 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">Last Login</p>
                <p className="font-bold text-gray-800 text-lg">
                  {lastCheckInTime ? new Date(lastCheckInTime).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-xs text-orange-600 font-semibold mb-1 uppercase tracking-wider">Last Logout</p>
                <p className="font-bold text-gray-800 text-lg">
                  {lastCheckOutTime ? new Date(lastCheckOutTime).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center items-center text-center">
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Total Work Duration</p>
              <div className="flex items-baseline space-x-2">
                <p className="font-extrabold text-gray-900 text-3xl">
                  {realStats.totalGrossHoursToday || "0.00"}
                </p>
                <span className="text-indigo-600 font-medium">hrs</span>
              </div>
              {isCheckedIn && (
                <div className="mt-2 text-center">
                  <div className="px-3 py-1 bg-white rounded-full shadow-sm text-xs font-semibold text-green-600 flex items-center justify-center animate-pulse mb-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active Session
                  </div>
                  <p className="text-sm font-mono text-indigo-800 font-bold">{elapsedTime}</p>
                </div>
              )}
            </div>
          </div>

          {/* Integrated Action Button */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            {!assignment ? (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-center text-amber-800 text-sm font-medium">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                Waiting for workplace assignment. Please contact your supervisor to enable check-in.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                {!isCheckedIn ? (
                  <button
                    onClick={handleCheckIn}
                    disabled={isProcessing}
                    className={`flex-1 btn-mobile font-bold py-4 text-lg ${isProcessing ? 'bg-gray-300' : 'bg-green-600 hover:bg-green-700'} text-white shadow-md shadow-green-100 transition-all active:scale-95`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <Loader className="h-5 w-5 animate-spin mr-2" />
                        {t('worker.checkingIn')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {t('worker.checkIn')}
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleCheckOut}
                    disabled={isProcessing}
                    className={`flex-1 btn-mobile font-bold py-4 text-lg ${isProcessing ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700'} text-white shadow-md shadow-red-100 transition-all active:scale-95`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <Loader className="h-5 w-5 animate-spin mr-2" />
                        {t('worker.checkingOut')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <XCircle className="h-5 w-5 mr-2" />
                        {t('worker.checkOut')}
                      </div>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Attendance Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart3 size={100} className="text-blue-600" />
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              My Attendance – {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentMonth)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="p-3 bg-green-500 rounded-lg text-white">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Present Days</p>
                <p className="text-2xl font-bold text-green-900">{stats.present}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="p-3 bg-red-500 rounded-lg text-white">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700">Absent Days</p>
                <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="p-3 bg-orange-500 rounded-lg text-white">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Incomplete Days</p>
                <p className="text-2xl font-bold text-orange-900">{stats.incomplete}</p>
              </div>
            </div>
          </div>

          {/* New Hours Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Gross Hours (Month)</span>
              <span className="text-xl font-bold text-blue-900">{stats.totalGrossHours}h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium">Effective Hours (Month)</span>
              <span className="text-xl font-bold text-purple-900">{stats.totalEffectiveHours}h</span>
            </div>
          </div>
        </div>

        {/* Quick Stats (Legacy) */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600">{t('department.present')}</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600">{t('department.absent')}</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
            <div className="text-sm text-gray-600">{t('worker.partial')}</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">{t('worker.totalDays')}</div>
          </div>
        </div> */}




        {/* Recent Attendance */}
        <div className="card-mobile">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('worker.recentAttendance')}
            </h3>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>

          <div className="space-y-3">
            {attendanceRecords.length === 0 ? (
              <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="mb-2 flex justify-center text-gray-300">
                  <Calendar size={48} />
                </div>
                <p className="font-medium text-lg">📭 No attendance data available for this month.</p>
                <p className="text-sm">Your records will appear here as you log in/out.</p>
              </div>
            ) : attendanceRecords.slice(0, 5).map((record) => (
              // ... existing record maps ...
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${record.status === 'present' ? 'bg-green-500' :
                    record.status === 'partial' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {record.status === 'present' ? t('department.present') :
                        record.status === 'partial' ? t('worker.partial') :
                          t('department.absent')}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  {record.checkInTime && (
                    <div>In: {record.checkInTime.toLocaleTimeString([], {
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  )}
                  {record.checkOutTime && (
                    <div>Out: {record.checkOutTime.toLocaleTimeString([], {
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {/* <div className="card-mobile">
            <div className="flex items-center space-x-3 mb-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t('worker.notifications')}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Monthly attendance report available</p>
              <p>• Safety training scheduled for next week</p>
              <p>• Wage payment processed</p>
            </div>
          </div> */}

          <div className="card-mobile">
            <div className="flex items-center space-x-3 mb-3">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t('worker.quickActions')}</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/profile/worker')}
                className="w-full text-left text-sm text-blue-600 hover:text-blue-700"
              >
                {t('worker.viewProfile')}
              </button>
              <button
                onClick={() => navigate('/attendance/history')}
                className="w-full text-left text-sm text-blue-600 hover:text-blue-700"
              >
                {t('worker.attendanceHistory')}
              </button>
              {/* <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                {t('worker.updateDocuments')}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;