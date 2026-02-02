import { api } from './api';
import { DUMMY_ESTABLISHMENT_DASHBOARD, DUMMY_DEPARTMENT_WISE_STATS, DUMMY_WORKERS_BY_ESTABLISHMENT, DUMMY_ESTABLISHMENTS } from './dummyData';

export interface WorkerSummary {
    workerId: number;
    fullName: string;
    status: 'Present' | 'Not Present' | 'Checked Out';
    checkInTime?: string;
    checkOutTime?: string;
}

export interface EstablishmentDashboardData {
    workers: WorkerSummary[];
    totalWorkers: number;
    presentCount: number;
    presentNow?: number;
    absentCount: number;
    totalCheckIns: number;
    totalCheckOuts: number;
}

export const establishmentApi = {
    // Fetch all workers for a specific establishment or the logged-in one
    getWorkers: async (establishmentId?: number): Promise<WorkerSummary[]> => {
        try {
            const url = establishmentId
                ? `/establishment/workerdetails?establishmentId=${establishmentId}`
                : '/establishment/workers';
            const res = await api<{ data: WorkerSummary[] }>(url, 'GET');
            if (res.data && res.data.length > 0) return res.data;

            if (establishmentId && DUMMY_WORKERS_BY_ESTABLISHMENT[establishmentId]) {
                return DUMMY_WORKERS_BY_ESTABLISHMENT[establishmentId];
            }

            return DUMMY_ESTABLISHMENT_DASHBOARD.workers;
        } catch (error) {
            console.error("Failed to fetch establishment workers, returning dummy data:", error);
            return DUMMY_ESTABLISHMENT_DASHBOARD.workers;
        }
    },

    // Get aggregated dashboard data if available, or we compute from workers
    getDashboardData: async (establishmentId?: number): Promise<EstablishmentDashboardData> => {
        const workers = await establishmentApi.getWorkers(establishmentId);

        // Try to find summary data for consistency
        const summary = establishmentId
            ? DUMMY_ESTABLISHMENTS.find(e => e.establishmentId === establishmentId)
            : null;

        // Use summary counts if available, otherwise calculate from workers
        const totalWorkers = summary ? summary.totalWorkers : workers.length;
        const presentCount = summary ? summary.presentNow : workers.filter(w => w.status === 'Present').length;
        const absentCount = totalWorkers - presentCount;

        const totalCheckOuts = summary ? (summary.checkedOutList?.length || 0) : workers.filter(w => w.checkOutTime).length;
        const totalCheckIns = summary ? (summary.presentNow + totalCheckOuts) : workers.filter(w => w.checkInTime).length;

        return {
            workers,
            totalWorkers,
            presentCount,
            presentNow: summary ? summary.presentNow : presentCount,
            absentCount,
            totalCheckIns,
            totalCheckOuts
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
