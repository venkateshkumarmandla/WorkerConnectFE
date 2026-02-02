import { api } from './api';
import { DUMMY_DEPARTMENT_STATS, DUMMY_ESTABLISHMENTS } from './dummyData';

export interface DepartmentStats {
    totalEstablishments: number;
    totalWorkers: number;
    workersPresent: number;
    workersAbsent: number;
    totalCheckIns: number;
    totalCheckOuts: number;
}

export interface EstablishmentSummary {
    establishmentId: number;
    name: string;
    location: string;
    totalWorkers: number;
    presentNow: number;
    checkedInList: Array<{
        workerId: number;
        fullName: string;
        checkInTime: string;
    }>;
    checkedOutList: Array<{
        workerId: number;
        fullName: string;
        checkOutTime: string;
    }>;
}

export const departmentApi = {
    // Fetch overall department statistics
    getStats: async (): Promise<DepartmentStats> => {
        try {
            const res = await api<{ data: DepartmentStats }>('/department/dashboard/stats', 'GET');
            return res.data || DUMMY_DEPARTMENT_STATS;
        } catch (error) {
            console.error("Failed to fetch department dashboard data, returning dummy data:", error);
            return DUMMY_DEPARTMENT_STATS;
        }
    },

    // Fetch all establishments with their active status
    getEstablishments: async (): Promise<EstablishmentSummary[]> => {
        try {
            const res = await api<{ data: EstablishmentSummary[] }>('/department/establishments', 'GET');
            return res.data && res.data.length > 0 ? res.data : DUMMY_ESTABLISHMENTS;
        } catch (error) {
            console.error("Failed to fetch establishments, returning dummy data:", error);
            return DUMMY_ESTABLISHMENTS;
        }
    },

    // Fetch specific establishment present status (detail view)
    getEstablishmentPresent: async (establishmentId: number) => {
        const res = await api<{ data: any }>(`/department/establishment/${establishmentId}/present`, 'GET');
        return res.data;
    }
};
