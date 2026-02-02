import { api } from './api';
import { DUMMY_ESTABLISHMENT_DASHBOARD, DUMMY_DEPARTMENT_WISE_STATS } from './dummyData';

export interface WorkerSummary {
    workerId: number;
    fullName: string;
    status: 'Present' | 'Not Present';
    checkInTime?: string;
    checkOutTime?: string;
}

export interface EstablishmentDashboardData {
    workers: WorkerSummary[];
    totalWorkers: number;
    presentCount: number;
    absentCount: number;
}

export const establishmentApi = {
    // Fetch all workers for a specific establishment or the logged-in one
    getWorkers: async (establishmentId?: number): Promise<WorkerSummary[]> => {
        try {
            const url = establishmentId
                ? `/establishment/workerdetails?establishmentId=${establishmentId}`
                : '/establishment/workers';
            const res = await api<{ data: WorkerSummary[] }>(url, 'GET');
            return res.data && res.data.length > 0 ? res.data : DUMMY_ESTABLISHMENT_DASHBOARD.workers;
        } catch (error) {
            console.error("Failed to fetch establishment workers, returning dummy data:", error);
            return DUMMY_ESTABLISHMENT_DASHBOARD.workers;
        }
    },

    // Get aggregated dashboard data if available, or we compute from workers
    getDashboardData: async (establishmentId?: number): Promise<EstablishmentDashboardData> => {
        // This might be a composite call or handled by the component
        const workers = await establishmentApi.getWorkers(establishmentId);

        // Calculate stats on client or fetch if backend provides
        const totalWorkers = workers.length;
        const presentCount = workers.filter(w => w.status === 'Present').length;
        const absentCount = totalWorkers - presentCount;

        return {
            workers,
            totalWorkers,
            presentCount,
            absentCount
        };
    },

    // Get department-wise statistics for establishment
    getDepartmentStats: async (establishmentId: number, date?: string): Promise<any> => {
        try {
            const params = date ? `?date=${date}` : '';
            const res = await api<{ data: any }>(`/attendance/establishment/${establishmentId}/department-stats${params}`, 'GET');
            return res.data && res.data.departments && res.data.departments.length > 0 ? res.data : { departments: DUMMY_DEPARTMENT_WISE_STATS };
        } catch (error) {
            console.error("Failed to fetch establishment department stats, returning dummy data:", error);
            return { departments: DUMMY_DEPARTMENT_WISE_STATS };
        }
    },

    // Get workers in a specific department with attendance
    getDepartmentWorkers: async (departmentName: string, establishmentId: number, date?: string): Promise<any> => {
        const params = new URLSearchParams({ establishmentId: establishmentId.toString() });
        if (date) params.append('date', date);
        const res = await api<{ data: any }>(`/attendance/department/${departmentName}/workers?${params}`, 'GET');
        return res.data;
    }
};
