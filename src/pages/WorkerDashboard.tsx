import React, { useState, useEffect } from 'react';
import { User, Calendar, Settings, Loader, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
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
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentMonth] = useState(new Date());
  const [assignment, setAssignment] = useState<{ id: number; estmtWorkerId: number; name: string } | null>(null);
  const canCheckInOut = !!(assignment?.id && assignment?.estmtWorkerId);


  const [realStats, setRealStats] = useState({ present: 0, incomplete: 0, absent: 0 });

  // Fetch real attendance data
  const fetchData = async () => {
    if (!user || user.type !== 'worker') return;

    try {
      const [details, history] = await Promise.all([
        getWorkerDashboardDetails(),
        getWorkerAttendanceHistory(user.id)
      ]);

      if (details) {
        // ... existing logic ...
        setIsCheckedIn(details.attendance.status === 'checked-in');
        setRealStats(details.stats || { present: 0, incomplete: 0, absent: 0 });
        if (details.establishment) {
          setAssignment({
            id: details.establishment.id,
            estmtWorkerId: details.establishment.estmtWorkerId,
            name: details.establishment.name
          });
        }
      } else if (user.id === 1) {
        // 🧪 UI Simulation Fallback for Worker ID 1
        console.log("🧪 Using Simulated Dummy Data for Worker ID 1");
        setIsCheckedIn(false);
        setRealStats({ present: 22, incomplete: 1, absent: 4 });
        setAssignment({
          id: 101,
          estmtWorkerId: 1001,
          name: "Simulated Construction Site"
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
      } else if (user.id === 1) {
        // 🧪 Mock History for Simulation
        setAttendanceRecords([
          {
            id: 'm1',
            date: new Date(),
            checkInTime: new Date(new Date().setHours(9, 0)),
            status: 'partial'
          },
          {
            id: 'm2',
            date: new Date(Date.now() - 86400000),
            checkInTime: new Date(new Date(Date.now() - 86400000).setHours(9, 15)),
            checkOutTime: new Date(new Date(Date.now() - 86400000).setHours(17, 30)),
            status: 'present'
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (user.id === 1) {
        // Even on error, keep simulation active for ID 1
        setRealStats({ present: 22, incomplete: 1, absent: 4 });
        setAttendanceRecords([{ id: 'm1', date: new Date(), status: 'partial' }]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // const handleCheckIn = async (coordinates: { latitude: number; longitude: number; timestamp: Date }) => {
  //   try {
  //     // In real app, send to API
  //     console.log('Check-in:', coordinates);

  //     setIsCheckedIn(true);
  //     setLastCheckInTime(coordinates.timestamp);

  //     // Add to attendance records
  //     const newRecord: AttendanceRecord = {
  //       id: Date.now().toString(),
  //       date: new Date(),
  //       checkInTime: coordinates.timestamp,
  //       checkInLocation: coordinates,
  //       status: 'partial'
  //     };

  //     setAttendanceRecords(prev => [newRecord, ...prev]);

  //     // Show success notification
  //     alert(t('worker.checkInSuccess'));
  //   } catch (error) {
  //     console.error('Check-in failed:', error);
  //     alert(t('worker.checkInError'));
  //   }
  // };

  // const handleCheckOut = async (coordinates: { latitude: number; longitude: number; timestamp: Date }) => {
  //   try {
  //     // In real app, send to API
  //     console.log('Check-out:', coordinates);

  //     setIsCheckedIn(false);

  //     // Update today's record
  //     setAttendanceRecords(prev =>
  //       prev.map(record => {
  //         if (record.checkInTime &&
  //           record.checkInTime.toDateString() === new Date().toDateString()) {
  //           return {
  //             ...record,
  //             checkOutTime: coordinates.timestamp,
  //             checkOutLocation: coordinates,
  //             status: 'present'
  //           };
  //         }
  //         return record;
  //       })
  //     );

  //     // Show success notification
  //     alert(t('worker.checkOutSuccess'));
  //   } catch (error) {
  //     console.error('Check-out failed:', error);
  //     alert(t('worker.checkOutError'));
  //   }
  // };



  const handleCheckIn = async () => {
    if (user?.type !== "worker") return;

    try {
      setIsProcessing(true);
      const payload: CheckInOutPayload = {
        // ... existing payload ...
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

      console.log("Check-in API response:", response.data);

      setIsCheckedIn(true);

      // Update local attendance records
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        date: new Date(),
        checkInTime: new Date(),
        status: "partial",
      };
      setAttendanceRecords((prev) => [newRecord, ...prev]);

      toast.success(response.data.message || "Login successful", {
        duration: 4000,
        position: "top-center",
      });
      // Refresh all data
      fetchData();
    } catch (error) {
      console.error("Check-in failed:", error);
      toast.error("worker.checkInError", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (user?.type !== "worker") return;

    try {
      setIsProcessing(true);
      const payload: CheckInOutPayload = {
        // ... existing payload ...
        attendanceId: 0,
        establishmentId: assignment?.id || 0,
        workerId: user.id,
        estmtWorkerId: assignment?.estmtWorkerId || 0,
        workLocation: assignment?.name || "Assigned Location",
        checkOutDateTime: new Date().toISOString(),
        status: "o",
      };

      const response = await checkInOrOut(payload);

      console.log("Check-out API response:", response.data);

      setIsCheckedIn(false);

      // Update today's record
      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record.checkInTime &&
            record.checkInTime.toDateString() === new Date().toDateString()
            ? {
              ...record,
              checkOutTime: new Date(),
              status: "present",
            }
            : record
        )
      );

      toast.success(response.data.message || "Logout successful", {
        duration: 4000,
        position: "top-center",
      });
      // Refresh all data
      fetchData();
    } catch (error) {
      console.error("Check-out failed:", error);
      toast.error("worker.checkOutError", {
        duration: 4000,
        position: "top-center",
      });
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Location Check-in */}
        {canCheckInOut ? (

          <div className="mb-8">
            {/* <LocationCheckIn
            workLocation={workLocation}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isCheckedIn={isCheckedIn}
            lastCheckInTime={lastCheckInTime}
          /> */}


            <div className="space-y-3">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  //     disabled={
                  //       isProcessing 
                  // }
                  // className={`w-full btn-mobile font-semibold ${workLocation
                  //     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  //     : 'bg-green-600 text-white hover:bg-green-700'
                  //   }`}
                  className='w-full btn-mobile font-semibold bg-green-600 text-white hover:bg-green-700'
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      {t('worker.checkingIn')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('worker.checkIn')}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  // disabled={isProcessing}
                  className="w-full btn-mobile bg-red-600 text-white hover:bg-red-700 font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      {t('worker.checkingOut')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('worker.checkOut')}
                    </div>
                  )}
                </button>
              )}


            </div>
          </div>
        ) : null}


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
                    <div>In: {record.checkInTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  )}
                  {record.checkOutTime && (
                    <div>Out: {record.checkOutTime.toLocaleTimeString('en-US', {
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
              <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                {t('worker.viewProfile')}
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
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