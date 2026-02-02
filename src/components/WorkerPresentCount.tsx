import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../api/attendance';
import { Users } from 'lucide-react';

interface WorkerPresentCountProps {
    count?: number | null;
}

const WorkerPresentCount: React.FC<WorkerPresentCountProps> = ({ count: propCount }) => {
    const [count, setCount] = useState<number | null>(propCount !== undefined ? propCount : null);

    useEffect(() => {
        // If propCount is provided (even if 0), use it and don't fetch from API
        if (propCount !== undefined) {
            setCount(propCount);
            return;
        }

        // Only fetch from API if no prop is provided
        const fetchCount = async () => {
            try {
                const val = await attendanceApi.getCurrentPresentCount();
                setCount(val);
            } catch (e) {
                console.error("Failed to fetch present count", e);
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, [propCount]);

    return (
        <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg relative">
                <Users className="h-5 w-5 text-green-600" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">Present Now</p>
                <p className="text-sm lg:text-base font-bold text-gray-900">
                    {count === null ? '...' : count.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default WorkerPresentCount;
