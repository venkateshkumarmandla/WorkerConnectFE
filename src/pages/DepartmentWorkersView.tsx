import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, ArrowLeft, Calendar, Phone } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { establishmentApi } from '../api/establishment';
import { toast } from 'react-hot-toast';

interface Worker {
    workerId: number;
    fullName: string;
    mobileNumber: string;
    emailId?: string;
    attendanceStatus: 'present' | 'absent';
    checkInTime: string | null;
    checkOutTime: string | null;
    workLocation: string | null;
}

const DepartmentWorkersView: React.FC = () => {
    const { departmentName } = useParams<{ departmentName: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        location.state?.date || new Date().toISOString().split('T')[0]
    );
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWorkers();
    }, [selectedDate, departmentName]);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            if (user?.type === 'establishment' && (user as any).id && departmentName) {
                const data = await establishmentApi.getDepartmentWorkers(
                    decodeURIComponent(departmentName),
                    (user as any).id,
                    selectedDate
                );
                setWorkers(data.workers || []);
            }
        } catch (error) {
            console.error('Failed to fetch department workers:', error);
            toast.error('Failed to load workers');
        } finally {
            setLoading(false);
        }
    };

    const filteredWorkers = workers.filter(worker =>
        worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.mobileNumber.includes(searchTerm)
    );

    const presentCount = workers.filter(w => w.attendanceStatus === 'present').length;
    const absentCount = workers.filter(w => w.attendanceStatus === 'absent').length;

    const formatTime = (dateTimeString: string | null) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen py-8 mobile-nav-spacing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Departments
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {decodeURIComponent(departmentName || '')} Department
                    </h1>
                    <p className="text-gray-600">Worker attendance details</p>
                </div>

                {/* Controls */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex items-center space-x-4">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Today
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="card-mobile">
                        <p className="text-sm text-gray-600 mb-1">Total Workers</p>
                        <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
                    </div>
                    <div className="card-mobile">
                        <p className="text-sm text-gray-600 mb-1">Present</p>
                        <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                    </div>
                    <div className="card-mobile">
                        <p className="text-sm text-gray-600 mb-1">Absent</p>
                        <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                    </div>
                    <div className="card-mobile">
                        <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {workers.length > 0 ? Math.round((presentCount / workers.length) * 100) : 0}%
                        </p>
                    </div>
                </div>

                {/* Workers Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Worker Name</th>
                                    <th className="px-4 py-3">Mobile</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Check-In</th>
                                    <th className="px-4 py-3">Check-Out</th>
                                    <th className="px-4 py-3">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredWorkers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                            {searchTerm ? 'No workers found matching your search' : 'No workers in this department'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredWorkers.map((worker) => (
                                        <tr key={worker.workerId} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {worker.fullName}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span>{worker.mobileNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${worker.attendanceStatus === 'present'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {worker.attendanceStatus === 'present' ? (
                                                        <span className="flex items-center space-x-1">
                                                            <UserCheck className="h-3 w-3" />
                                                            <span>Present</span>
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center space-x-1">
                                                            <UserX className="h-3 w-3" />
                                                            <span>Absent</span>
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {formatTime(worker.checkInTime)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {formatTime(worker.checkOutTime)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {worker.workLocation || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentWorkersView;
