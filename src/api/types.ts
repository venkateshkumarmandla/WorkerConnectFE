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
