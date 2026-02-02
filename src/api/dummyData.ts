import { DepartmentStats, EstablishmentSummary } from './department';
import { EstablishmentDashboardData } from './establishment';

export const DUMMY_DEPARTMENT_STATS: DepartmentStats = {
    totalEstablishments: 12,
    totalWorkers: 1250,
    workersPresent: 850,
    workersAbsent: 400,
    totalCheckIns: 850,
    totalCheckOuts: 150
};

export const DUMMY_ESTABLISHMENTS: EstablishmentSummary[] = [
    {
        establishmentId: 1,
        name: "Tech Solutions Hub",
        location: "Hyderabad, HITEC City",
        totalWorkers: 250,
        presentNow: 180,
        checkedInList: [
            { workerId: 1, fullName: "John Doe", checkInTime: new Date().toISOString() },
            { workerId: 2, fullName: "Jane Smith", checkInTime: new Date().toISOString() }
        ]
    },
    {
        establishmentId: 2,
        name: "Global Manufacturing Unit",
        location: "Vizag, Industrial Area",
        totalWorkers: 500,
        presentNow: 320,
        checkedInList: [
            { workerId: 3, fullName: "Robert Wilson", checkInTime: new Date().toISOString() }
        ]
    },
    {
        establishmentId: 3,
        name: "Creative Design Studio",
        location: "Kakinada, Smart City",
        totalWorkers: 150,
        presentNow: 120,
        checkedInList: []
    }
];

export const DUMMY_ESTABLISHMENT_DASHBOARD: EstablishmentDashboardData = {
    totalWorkers: 450,
    presentCount: 380,
    absentCount: 70,
    workers: [
        { workerId: 101, fullName: "Alice Johnson", status: 'Present', checkInTime: "2026-02-02T09:00:00Z" },
        { workerId: 102, fullName: "Bob Miller", status: 'Not Present' },
        { workerId: 103, fullName: "Charlie Davis", status: 'Present', checkInTime: "2026-02-02T08:30:00Z" },
        { workerId: 104, fullName: "Diana Prince", status: 'Present', checkInTime: "2026-02-02T09:15:00Z" },
        { workerId: 105, fullName: "Ethan Hunt", status: 'Not Present' }
    ]
};

export const DUMMY_DEPARTMENT_WISE_STATS = [
    {
        departmentName: "Information Technology",
        totalWorkers: 120,
        presentToday: 110,
        absentToday: 10
    },
    {
        departmentName: "Human Resources",
        totalWorkers: 45,
        presentToday: 40,
        absentToday: 5
    },
    {
        departmentName: "Operations",
        totalWorkers: 200,
        presentToday: 165,
        absentToday: 35
    },
    {
        departmentName: "Finance",
        totalWorkers: 35,
        presentToday: 35,
        absentToday: 0
    }
];

export const DUMMY_WORKERS = [
    {
        id: "1",
        firstName: "Ravi Kumar Sharma",
        aadhaarCardNumber: "XXXX-XXXX-1234",
        mobileNumber: "9876543210",
        workingFromDate: "2024-01-15",
        workingToDate: "2024-12-31",
        status: "active",
        attendanceStatus: "checked-in"
    },
    {
        id: "2",
        firstName: "Priya Devi",
        aadhaarCardNumber: "XXXX-XXXX-5678",
        mobileNumber: "9876543211",
        workingFromDate: "2024-02-01",
        workingToDate: "2024-11-30",
        status: "active",
        attendanceStatus: "checked-out"
    },
    {
        id: "3",
        firstName: "Suresh Reddy",
        aadhaarCardNumber: "XXXX-XXXX-9012",
        mobileNumber: "9876543212",
        workingFromDate: "2023-12-10",
        workingToDate: "2024-10-15",
        status: "inactive",
        attendanceStatus: "absent"
    },
    {
        id: "4",
        firstName: "Anjali Singh",
        aadhaarCardNumber: "XXXX-XXXX-3456",
        mobileNumber: "9876543213",
        workingFromDate: "2024-03-01",
        workingToDate: "2025-03-01",
        status: "active",
        attendanceStatus: "checked-in"
    }
];

export const DUMMY_REPORT_DATA = {
    worker_summary: {
        totalWorkers: 1250,
        activeWorkers: 1100,
        maleWorkers: 850,
        femaleWorkers: 400,
        skilledWorkers: 500,
        semiSkilledWorkers: 450,
        unskilledWorkers: 300,
        districtWise: [
            { district: 'Hyderabad', count: 450 },
            { district: 'Visakhapatnam', count: 320 },
            { district: 'Guntur', count: 180 },
            { district: 'Krishna', count: 150 },
            { district: 'Kurnool', count: 150 }
        ]
    },
    establishment_summary: {
        totalEstablishments: 12,
        activeEstablishments: 10,
        privateCommercial: 5,
        privateResidential: 3,
        stateGovernment: 2,
        centralGovernment: 2,
        totalProjectValue: 1500000000,
        totalWorkers: 1250
    },
    attendance_report: {
        averageAttendance: 88,
        presentToday: 1100,
        absentToday: 150,
        monthlyTrend: [
            { month: 'Jan', attendance: 85 },
            { month: 'Feb', attendance: 88 },
            { month: 'Mar', attendance: 90 },
            { month: 'Apr', attendance: 87 },
            { month: 'May', attendance: 92 },
            { month: 'Jun', attendance: 89 }
        ]
    }
};
