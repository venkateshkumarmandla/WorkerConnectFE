import { DepartmentStats, EstablishmentSummary } from './types';
import { EstablishmentDashboardData, WorkerSummary } from './establishment';

// Helper to generate workers
const generateWorkers = (count: number, startId: number): WorkerSummary[] => {
    const locations = ["Amaravati Gandhi Nagar", "Guntur MG Street", "Vijayawada Benz Circle", "Visakhapatnam Beach Road", "Nellore Trunk Road", "Kurnool Bellary Road"];
    const gates = ["North Gate", "South Gate", "East Gate", "West Gate", "Gate 1", "Gate 2", "Gate 3", "Gate 4"];
    const names = [
        "Ravi Kumar Reddy", "Suresh Babu", "K. Prasad", "M. Rajesh Kumar", "B. Shiva Prasad", "P. Venkat",
        "S. Murthy", "D. Lakshmi", "G. Ramana", "V. Krishna", "T. Naidu", "J. Sai",
        "Lakshmi Narayana", "P. Rajesh", "M. Satyam", "K. Bhanu", "A. Srikanth", "V. Ravi",
        "S. Anitha", "R. Mohit", "Chandra Sekhar", "Anitha Reddy", "L. Babu", "M. Ganga",
        "T. Somu", "B. Ratnam", "Mohan Krishna", "S. Venkatesh", "D. Rao", "J. Bhavani"
    ];

    return Array.from({ length: count }, (_, i) => {
        const isPresent = Math.random() > 0.3; // 70% present
        const hasCheckedOut = isPresent && Math.random() > 0.7; // 30% of present have checked out
        const nameIndex = (startId + i) % names.length;

        let status: 'Present' | 'Not Present' | 'Checked Out' = 'Not Present';
        let checkInTime: string | undefined;
        let checkOutTime: string | undefined;

        if (isPresent) {
            status = 'Present';
            checkInTime = `2026-02-02T${String(8 + Math.floor(Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`;

            if (hasCheckedOut) {
                status = 'Checked Out';
                checkOutTime = `2026-02-02T${String(16 + Math.floor(Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`;
            }
        }

        return {
            workerId: startId + i,
            fullName: names[nameIndex], // Removed index suffix
            status,
            checkInTime,
            checkOutTime,
            siteLocation: locations[Math.floor(i / 10) % locations.length], // Rotate every 10 workers
            gate: isPresent || hasCheckedOut ? gates[Math.floor(Math.random() * gates.length)] : undefined
        };
    });
};


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
    workers: generateWorkers(25, 100)
};

export const DUMMY_WORKERS_BY_ESTABLISHMENT: Record<number, WorkerSummary[]> = {
    1: generateWorkers(24, 100),
    2: generateWorkers(22, 200),
    3: generateWorkers(25, 300),
    4: generateWorkers(20, 400),
    5: generateWorkers(28, 500),
    6: generateWorkers(23, 600)
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
