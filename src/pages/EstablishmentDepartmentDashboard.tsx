import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { establishmentApi } from '../api/establishment';
import { toast } from 'react-hot-toast';

interface DepartmentStats {
    departmentName: string;
    totalWorkers: number;
    presentToday: number;
    absentToday: number;
}

const EstablishmentDepartmentDashboard: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [departments, setDepartments] = useState<DepartmentStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchDepartmentStats();
    }, [selectedDate]);

    const fetchDepartmentStats = async () => {
        try {
            setLoading(true);
            if (user?.type === 'establishment' && (user as any).id) {
                const data = await establishmentApi.getDepartmentStats((user as any).id, selectedDate);
                setDepartments(data.departments || []);
            }
        } catch (error) {
            console.error('Failed to fetch department stats:', error);
            toast.error('Failed to load department statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentClick = (departmentName: string) => {
        navigate(`/department/${encodeURIComponent(departmentName)}/workers`, {
            state: { date: selectedDate }
        });
    };

    const DepartmentCard = ({ dept }: { dept: DepartmentStats }) => {
        const attendancePercentage = dept.totalWorkers > 0
            ? Math.round((dept.presentToday / dept.totalWorkers) * 100)
            : 0;

        return (
            <div
                onClick={() => handleDepartmentClick(dept.departmentName)}
                className="card-mobile hover:shadow-xl transition-all cursor-pointer group"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{dept.departmentName}</h3>
                    <Users className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>

                <div className="space-y-3">
                    {/* Total Workers */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Workers</span>
                        <span className="text-lg font-bold text-gray-900">{dept.totalWorkers}</span>
                    </div>

                    {/* Present Today */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">Present</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            {dept.presentToday}
                        </span>
                    </div>

                    {/* Absent Today */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <UserX className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-gray-600">Absent</span>
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            {dept.absentToday}
                        </span>
                    </div>

                    {/* Attendance Percentage */}
                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">Attendance Rate</span>
                            <span className="text-sm font-bold text-blue-600">{attendancePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${attendancePercentage >= 90 ? 'bg-green-500' :
                                    attendancePercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${attendancePercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-blue-600 group-hover:text-blue-700 text-sm font-medium flex items-center">
                    View Workers →
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-8 mobile-nav-spacing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Department-wise Attendance Overview
                    </h1>
                    <p className="text-gray-600">
                        Monitor attendance across all departments
                    </p>
                </div>

                {/* Date Selector */}
                <div className="mb-6 flex items-center space-x-4">
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

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No department data available for this date</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="card-mobile">
                                <p className="text-sm text-gray-600 mb-1">Total Departments</p>
                                <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
                            </div>
                            <div className="card-mobile">
                                <p className="text-sm text-gray-600 mb-1">Total Workers</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {departments.reduce((sum, d) => sum + d.totalWorkers, 0)}
                                </p>
                            </div>
                            <div className="card-mobile">
                                <p className="text-sm text-gray-600 mb-1">Total Present</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {departments.reduce((sum, d) => sum + d.presentToday, 0)}
                                </p>
                            </div>
                            <div className="card-mobile">
                                <p className="text-sm text-gray-600 mb-1">Total Absent</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {departments.reduce((sum, d) => sum + d.absentToday, 0)}
                                </p>
                            </div>
                        </div>

                        {/* Department Cards Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map((dept) => (
                                <DepartmentCard key={dept.departmentName} dept={dept} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EstablishmentDepartmentDashboard;
