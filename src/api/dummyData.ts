import { DepartmentStats, EstablishmentSummary } from './department';
import { EstablishmentDashboardData, WorkerSummary } from './establishment';

export const DUMMY_DEPARTMENT_STATS: DepartmentStats = {
    totalEstablishments: 6,
    totalWorkers: 450,
    workersPresent: 320,
    workersAbsent: 130,
    totalCheckIns: 320,
    totalCheckOuts: 45
};

export const DUMMY_ESTABLISHMENTS: EstablishmentSummary[] = [
    {
        establishmentId: 1,
        name: "Larsen & Toubro (L&T)",
        location: "Visakhapatnam, Andhra Pradesh",
        totalWorkers: 80,
        presentNow: 62,
        checkedInList: [
            { workerId: 1, fullName: "Ravi Kumar Reddy", checkInTime: "08:45 AM" },
            { workerId: 2, fullName: "Suresh Babu", checkInTime: "09:10 AM" }
        ],
        checkedOutList: [
            { workerId: 5, fullName: "K. Prasad", checkOutTime: "05:15 PM" }
        ]
    },
    {
        establishmentId: 2,
        name: "Tata Projects",
        location: "Vijayawada, Amaravati Region",
        totalWorkers: 95,
        presentNow: 78,
        checkedInList: [
            { workerId: 3, fullName: "Lakshmi Narayana", checkInTime: "08:15 AM" },
            { workerId: 304, fullName: "P. Rajesh", checkInTime: "08:30 AM" }
        ],
        checkedOutList: [
            { workerId: 206, fullName: "M. Satyam", checkOutTime: "04:45 PM" }
        ]
    },
    {
        establishmentId: 3,
        name: "NCC Ltd. (Nagarjuna Construction)",
        location: "Guntur, Andhra Pradesh",
        totalWorkers: 65,
        presentNow: 48,
        checkedInList: [
            { workerId: 301, fullName: "Chandra Sekhar", checkInTime: "09:00 AM" },
            { workerId: 302, fullName: "Anitha Reddy", checkInTime: "09:15 AM" }
        ],
        checkedOutList: [
            { workerId: 308, fullName: "L. Babu", checkOutTime: "05:30 PM" }
        ]
    },
    {
        establishmentId: 4,
        name: "Shapoorji Pallonji",
        location: "Nellore, Andhra Pradesh",
        totalWorkers: 75,
        presentNow: 55,
        checkedInList: [
            { workerId: 401, fullName: "Mohan Krishna", checkInTime: "08:00 AM" },
            { workerId: 403, fullName: "S. Venkatesh", checkInTime: "08:45 AM" }
        ],
        checkedOutList: [
            { workerId: 408, fullName: "D. Rao", checkOutTime: "06:00 PM" }
        ]
    },
    {
        establishmentId: 5,
        name: "Afcons Infrastructure",
        location: "Kurnool, Andhra Pradesh",
        totalWorkers: 85,
        presentNow: 60,
        checkedInList: [
            { workerId: 501, fullName: "Venkatesh Prasad", checkInTime: "08:30 AM" },
            { workerId: 503, fullName: "K. Murali", checkInTime: "09:05 AM" }
        ],
        checkedOutList: [
            { workerId: 508, fullName: "S. Kumar", checkOutTime: "05:00 PM" }
        ]
    },
    {
        establishmentId: 6,
        name: "Dilip Buildcon",
        location: "Tirupati, Andhra Pradesh",
        totalWorkers: 50,
        presentNow: 35,
        checkedInList: [
            { workerId: 601, fullName: "Anjaneyulu Rao", checkInTime: "08:50 AM" },
            { workerId: 603, fullName: "G. Ramu", checkInTime: "09:20 AM" }
        ],
        checkedOutList: [
            { workerId: 608, fullName: "A. Naidu", checkOutTime: "04:30 PM" }
        ]
    }
];

export const DUMMY_ESTABLISHMENT_DASHBOARD: EstablishmentDashboardData = {
    totalWorkers: 100,
    presentCount: 85,
    absentCount: 15,
    totalCheckIns: 85,
    totalCheckOuts: 10,
    workers: [
        { workerId: 101, fullName: "Venkatesh Prasad", status: 'Present', checkInTime: "2026-02-02T09:00:00Z" },
        { workerId: 102, fullName: "Satyam Naidu", status: 'Checked Out', checkInTime: "2026-02-02T08:00:00Z", checkOutTime: "2026-02-02T17:00:00Z" },
        { workerId: 103, fullName: "Anjaneyulu Rao", status: 'Present', checkInTime: "2026-02-02T08:30:00Z" },
        { workerId: 104, fullName: "Sai Ram K.", status: 'Present', checkInTime: "2026-02-02T09:15:00Z" },
        { workerId: 105, fullName: "Appa Rao M.", status: 'Checked Out', checkInTime: "2026-02-02T08:15:00Z", checkOutTime: "2026-02-02T16:45:00Z" },
        { workerId: 106, fullName: "M. Rajesh Kumar", status: 'Present', checkInTime: "2026-02-02T08:45:00Z" },
        { workerId: 107, fullName: "B. Shiva Prasad", status: 'Present', checkInTime: "2026-02-02T09:20:00Z" }
    ]
};

export const DUMMY_WORKERS_BY_ESTABLISHMENT: Record<number, WorkerSummary[]> = {
    1: [
        { workerId: 101, fullName: "Ravi Kumar Reddy", status: 'Present', checkInTime: "2026-02-02T08:45:00Z" },
        { workerId: 102, fullName: "Suresh Babu", status: 'Present', checkInTime: "2026-02-02T09:10:00Z" },
        { workerId: 103, fullName: "K. Prasad", status: 'Checked Out', checkInTime: "2026-02-02T08:00:00Z", checkOutTime: "2026-02-02T17:15:00Z" },
        { workerId: 104, fullName: "M. Rajesh Kumar", status: 'Present', checkInTime: "2026-02-02T08:30:00Z" },
        { workerId: 105, fullName: "B. Shiva Prasad", status: 'Present', checkInTime: "2026-02-02T09:05:00Z" },
        { workerId: 106, fullName: "P. Venkat", status: 'Checked Out', checkInTime: "2026-02-02T08:10:00Z", checkOutTime: "2026-02-02T16:50:00Z" },
        { workerId: 107, fullName: "S. Murthy", status: 'Present', checkInTime: "2026-02-02T08:15:00Z" },
        { workerId: 108, fullName: "D. Lakshmi", status: 'Present', checkInTime: "2026-02-02T08:55:00Z" },
        { workerId: 109, fullName: "G. Ramana", status: 'Present', checkInTime: "2026-02-02T09:20:00Z" },
        { workerId: 110, fullName: "V. Krishna", status: 'Checked Out', checkInTime: "2026-02-02T08:25:00Z", checkOutTime: "2026-02-02T17:45:00Z" },
        { workerId: 111, fullName: "T. Naidu", status: 'Present', checkInTime: "2026-02-02T08:40:00Z" },
        { workerId: 112, fullName: "J. Sai", status: 'Present', checkInTime: "2026-02-02T09:00:00Z" }
    ],
    2: [
        { workerId: 201, fullName: "Lakshmi Narayana", status: 'Present', checkInTime: "2026-02-02T08:15:00Z" },
        { workerId: 202, fullName: "P. Rajesh", status: 'Present', checkInTime: "2026-02-02T08:30:00Z" },
        { workerId: 203, fullName: "M. Satyam", status: 'Checked Out', checkOutTime: "2026-02-02T16:45:00Z" },
        { workerId: 204, fullName: "K. Bhanu", status: 'Present', checkInTime: "2026-02-02T08:05:00Z" },
        { workerId: 205, fullName: "A. Srikanth", status: 'Present', checkInTime: "2026-02-02T09:00:00Z" },
        { workerId: 206, fullName: "V. Ravi", status: 'Checked Out', checkOutTime: "2026-02-02T17:10:00Z" },
        { workerId: 207, fullName: "S. Anitha", status: 'Present', checkInTime: "2026-02-02T08:45:00Z" },
        { workerId: 208, fullName: "R. Mohit", status: 'Present', checkInTime: "2026-02-02T08:55:00Z" }
    ],
    3: [
        { workerId: 301, fullName: "Chandra Sekhar", status: 'Present', checkInTime: "2026-02-02T09:00:00Z" },
        { workerId: 302, fullName: "Anitha Reddy", status: 'Present', checkInTime: "2026-02-02T09:15:00Z" },
        { workerId: 303, fullName: "L. Babu", status: 'Checked Out', checkOutTime: "2026-02-02T17:30:00Z" },
        { workerId: 304, fullName: "M. Ganga", status: 'Present', checkInTime: "2026-02-02T08:50:00Z" },
        { workerId: 305, fullName: "T. Somu", status: 'Present', checkInTime: "2026-02-02T09:10:00Z" },
        { workerId: 306, fullName: "B. Ratnam", status: 'Checked Out', checkOutTime: "2026-02-02T16:55:00Z" }
    ],
    4: [
        { workerId: 401, fullName: "Mohan Krishna", status: 'Present', checkInTime: "2026-02-02T08:00:00Z" },
        { workerId: 402, fullName: "S. Venkatesh", status: 'Present', checkInTime: "2026-02-02T08:45:00Z" },
        { workerId: 403, fullName: "D. Rao", status: 'Checked Out', checkOutTime: "2026-02-02T18:00:00Z" },
        { workerId: 404, fullName: "J. Bhavani", status: 'Present', checkInTime: "2026-02-02T08:20:00Z" },
        { workerId: 405, fullName: "K. Mohan", status: 'Present', checkInTime: "2026-02-02T08:55:00Z" }
    ],
    5: [
        { workerId: 501, fullName: "Venkatesh Prasad", status: 'Present', checkInTime: "2026-02-02T08:30:00Z" },
        { workerId: 502, fullName: "K. Murali", status: 'Present', checkInTime: "2026-02-02T09:05:00Z" },
        { workerId: 503, fullName: "S. Kumar", status: 'Checked Out', checkOutTime: "2026-02-02T17:00:00Z" },
        { workerId: 504, fullName: "M. Surya", status: 'Present', checkInTime: "2026-02-02T08:40:00Z" },
        { workerId: 505, fullName: "R. Prakash", status: 'Present', checkInTime: "2026-02-02T09:15:00Z" }
    ],
    6: [
        { workerId: 601, fullName: "Anjaneyulu Rao", status: 'Present', checkInTime: "2026-02-02T08:50:00Z" },
        { workerId: 602, fullName: "G. Ramu", status: 'Present', checkInTime: "2026-02-02T09:20:00Z" },
        { workerId: 603, fullName: "A. Naidu", status: 'Checked Out', checkOutTime: "2026-02-02T16:30:00Z" },
        { workerId: 604, fullName: "V. Raju", status: 'Present', checkInTime: "2026-02-02T08:55:00Z" },
        { workerId: 605, fullName: "K. Madhavi", status: 'Present', checkInTime: "2026-02-02T09:30:00Z" }
    ]
};

export const DUMMY_DEPARTMENT_WISE_STATS = [
    {
        departmentName: "Roads & Buildings",
        totalWorkers: 120,
        presentToday: 110,
        absentToday: 10
    },
    {
        departmentName: "Urban Development",
        totalWorkers: 45,
        presentToday: 40,
        absentToday: 5
    },
    {
        departmentName: "Water Resources",
        totalWorkers: 200,
        presentToday: 165,
        absentToday: 35
    },
    {
        departmentName: "Energy Dept",
        totalWorkers: 35,
        presentToday: 35,
        absentToday: 0
    }
];

export const DUMMY_WORKERS = [
    {
        id: "1",
        firstName: "Ravi Kumar Reddy",
        aadhaarCardNumber: "XXXX-XXXX-1234",
        mobileNumber: "9876543210",
        workingFromDate: "2024-01-15",
        workingToDate: "2024-12-31",
        status: "active",
        attendanceStatus: "checked-in"
    },
    {
        id: "2",
        firstName: "B. Lakshmi",
        aadhaarCardNumber: "XXXX-XXXX-5678",
        mobileNumber: "9876543211",
        workingFromDate: "2024-02-01",
        workingToDate: "2024-11-30",
        status: "active",
        attendanceStatus: "checked-out"
    },
    {
        id: "3",
        firstName: "Suresh Babu",
        aadhaarCardNumber: "XXXX-XXXX-9012",
        mobileNumber: "9876543212",
        workingFromDate: "2023-12-10",
        workingToDate: "2024-10-15",
        status: "active",
        attendanceStatus: "absent"
    },
    {
        id: "4",
        firstName: "K. Durga Rao",
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
            { district: 'Visakhapatnam', count: 450 },
            { district: 'Vijayawada', count: 320 },
            { district: 'Guntur', count: 180 },
            { district: 'Nellore', count: 150 },
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
