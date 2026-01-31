import React, { createContext, useContext, useState, ReactNode, useEffect, useLayoutEffect } from 'react';
import { fetchAuthUser, getWorkerProfile } from '../api/api';
import { storage } from '../utils/storage';

// interface User {
//   id: number;
//   type: 'worker' | 'establishment' | 'department';
//   firstName: string;
//   middleName?: string;
//   lastName?: string;
//   fullName?: string;
//   emailId?: string;
//   mobileNumber?: number;
//   lastLoggedIn?: string;
// }

// export interface User {
//   id: number;                 // unique id for all
//   type: "worker" | "establishment" | "department";

//   // display info
//   fullName: string;
//   emailId?: string;
//   mobileNumber?: number;

//   // extra info depending on type
//   roleName?: string;           // for department
//   establishmentName?: string;  // for establishment
//   contactPerson?: string;      // for establishment
//   lastLoggedIn?: string | null;
// }

// Worker login response
export interface WorkerUser {
  type: "worker";
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  mobileNumber: number;
  emailId: string;
  lastLoggedIn?: string | null;
  establishmentId: number;
  estmtWorkerId: number;
  establishmentName: string;
  workLocation: string;
  status: string;
  attendanceMessage?: string | null;

  // Profile Fields
  aadhaarNumber?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  age?: number;
  caste?: string;
  subCaste?: string;

  // Identifiers
  eSharmId?: string;
  boCwId?: string;

  // Address
  permanentAddress?: {
    doorNumber: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: number;
  };
  presentAddress?: {
    doorNumber: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: number;
  };
}

// Establishment login response
export interface EstablishmentUser {
  type: "establishment";
  establishmentId: number;
  establishmentName: string;
  mobileNumber: number;
  emailId: string;
  contactPerson: string;
  lastLoggedIn?: string | null;
  logoUrl?: string | null;
}

// Department login response
export interface DepartmentUser {
  type: "department";
  departmentRoleId: number;
  roleName: string;
  roleDescription: string;
  departmentUserId: number;
  emailId: string;
  contactNumber: number;
  lastLoggedIn?: string | null;
}

export type User = WorkerUser | EstablishmentUser | DepartmentUser;



// Worker login response → User
// export function mapWorkerToUser(data: any): WorkerUser {
//   return {
//     id: data.id,
//     type: "worker",
//     fullName: data.fullName,
//     emailId: data.emailId,
//     mobileNumber: data.mobileNumber,
//     lastLoggedIn: data.lastLoggedIn,
//   };
// }

// // Establishment login response → User
// export function mapEstablishmentToUser(data: any): User {
//   return {
//     id: data.establishmentId,
//     type: "establishment",
//     fullName: data.establishmentName, // normalize to fullName
//     emailId: data.emailId,
//     mobileNumber: data.mobileNumber,
//     contactPerson: data.contactPerson,
//     lastLoggedIn: data.lastLoggedIn,
//     establishmentName: data.establishmentName,
//   };
// }

// // Department login response → User
// export function mapDepartmentToUser(data: any): User {
//   return {
//     departmentUserId: data.departmentUserId,
//     type: "department",
//     // fullName: data.roleName, // or roleName + " Dept"
//     emailId: data.emailId,
//     contactNumber: data.contactNumber,
//     roleName: data.roleName,
//     lastLoggedIn: data.lastLoggedIn,
//     roleDescription: data.roleDescription,
//   };
// }


export function mapWorkerToUser(data: any): WorkerUser {
  return {
    type: "worker",
    id: data.id,
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    fullName: data.fullName,
    emailId: data.emailId,
    mobileNumber: data.mobileNumber,
    lastLoggedIn: data.lastLoggedIn,
    establishmentId: data.establishmentId,
    estmtWorkerId: data.estmtWorkerId,
    establishmentName: data.establishmentName,
    workLocation: data.workLocation,
    status: data.status,
    attendanceMessage: data.attendanceMessage,
  };
}

// Establishment login response → User
export function mapEstablishmentToUser(data: any): EstablishmentUser {
  return {
    type: "establishment",
    establishmentId: data.establishmentId,
    establishmentName: data.establishmentName,
    emailId: data.emailId,
    mobileNumber: data.mobileNumber,
    contactPerson: data.contactPerson,
    lastLoggedIn: data.lastLoggedIn,
    logoUrl: data.logoUrl || null,
  };
}

// Department login response → User
export function mapDepartmentToUser(data: any): DepartmentUser {
  return {
    type: "department",
    departmentRoleId: data.departmentRoleId,
    departmentUserId: data.departmentUserId,
    roleName: data.roleName,
    roleDescription: data.roleDescription,
    emailId: data.emailId,
    contactNumber: data.contactNumber,
    lastLoggedIn: data.lastLoggedIn,
  };
}


interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  expiresAt?: number | null;   // 👈 add
  loading: boolean;            // 👈 add
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log(context, 'contenxt')
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // NEW: Synchronously check URL for session_token before any effects run
  // This prevents race conditions where child components call API before token is saved.
  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // 1. Check for JWT Token (New Standard)
    const jwtToken = searchParams.get('token');
    // 2. Check for Session Token (Legacy/Mobile)
    const urlSessionToken = searchParams.get('session_token');

    const saveTokens = async () => {
      if (jwtToken) {
        console.log("🔑 Found JWT token, saving to storage...");
        await storage.set('auth_token', jwtToken);
      }
      if (urlSessionToken) {
        console.log("Found session_token in URL, saving to storage...");
        await storage.set('session_token', urlSessionToken);
      }
    };

    if (jwtToken || urlSessionToken) {
      saveTokens().then(() => {
        // Clean URL if we found any tokens
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      });
    }
  }, []);

  const login = (userData: User) => {
    const expiresAt = Date.now() + 60 * 60 * 1000;
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authExpiry", expiresAt.toString());

    // Auto-set role for compatibility with useRole /AuthGuard
    if (userData.type) {
      localStorage.setItem('role', userData.type);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authExpiry");

    await storage.remove("session_token");
    await storage.remove("auth_token");
    await storage.remove("worker_id");
    await storage.remove("role");
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 initializing Auth System...");

        // 1. Check Persistent Storage OR URL Params (Priority to URL to avoid race)
        const searchParams = new URLSearchParams(window.location.search);
        const urlToken = searchParams.get('token');

        let token = await storage.get('auth_token');
        if (urlToken) {
          console.log("⚡️ Detected Token in URL during Init, using it immediately.");
          token = urlToken;
          // We rely on useLayoutEffect to save it, or we can await save here if we want to be double sure, 
          // but using it in memory is enough for this render.
        }

        const workerId = await storage.get('worker_id');
        const storedRole = await storage.get('role');

        let restored = false;

        if (token && workerId && storedRole === 'worker') {
          console.log(`✅ Found persisted worker session: ID ${workerId}`);
          try {
            // Fetch Fresh Profile
            const profileResponse = await getWorkerProfile(parseInt(workerId));
            if (profileResponse) {
              const rawWorker = profileResponse;
              const mappedUser: WorkerUser = {
                type: 'worker',
                id: rawWorker.worker_id || rawWorker.id,
                firstName: rawWorker.first_name || rawWorker.firstName,
                lastName: rawWorker.last_name || rawWorker.lastName,
                fullName: rawWorker.full_name || rawWorker.fullName,
                mobileNumber: rawWorker.mobile_number || rawWorker.mobileNumber,
                emailId: rawWorker.email_id || rawWorker.emailId,
                lastLoggedIn: new Date().toISOString(),
                establishmentId: 0,
                estmtWorkerId: 0,
                establishmentName: '',
                workLocation: rawWorker.work_location || '',
                status: rawWorker.status,

                // New Fields
                aadhaarNumber: rawWorker.aadhaar_number,
                gender: rawWorker.gender,
                maritalStatus: rawWorker.marital_status,
                dateOfBirth: rawWorker.date_of_birth,
                age: rawWorker.age,
                caste: rawWorker.caste,
                subCaste: rawWorker.sub_caste,
                eSharmId: rawWorker.e_sharm_id,
                boCwId: rawWorker.bo_cw_id,

                presentAddress: {
                  doorNumber: rawWorker.pre_door_number,
                  street: rawWorker.pre_street,
                  state: rawWorker.pre_state_code,
                  district: rawWorker.pre_district_code,
                  city: rawWorker.pre_city_code,
                  pincode: rawWorker.pre_pincode
                },
                permanentAddress: {
                  doorNumber: rawWorker.per_door_number,
                  street: rawWorker.per_street,
                  state: rawWorker.per_state_code,
                  district: rawWorker.per_district_code,
                  city: rawWorker.per_city_code,
                  pincode: rawWorker.per_pincode
                }
              };

              login(mappedUser); // Updates state & local storage
              restored = true;
              console.log("✅ Worker Profile Restored from API");
            }
          } catch (err) {
            console.error("❌ Failed to fetch worker profile with persisted ID", err);
            // If this fails (e.g. 401), we might want to try fetchAuthUser as fallback or just fail
            // Failing here likely means token is invalid.
          }
        }

        if (restored) {
          setLoading(false);
          return;
        }

        // 2. Validate/Fetch session from backend (Cookie-based / SAML fallback)
        try {
          const remoteUser = await fetchAuthUser();
          console.log("✅ Fetched Remote User (SAML/Cookie):", remoteUser);

          // Backend returns: { nameID, role, name, establishmentId, ... }
          // We need to map 'role' to 'type' and create proper User object
          if (remoteUser && remoteUser.role) {
            let mappedUser: User | null = null;

            // Re-use existing mapping logic but ensure we handle worker carefully
            if (remoteUser.role === 'worker') {
              // Warning: We might not have the correct numeric ID here if not standard
              // If we have a persisted ID, we should have used it above.

              // Safe parsing for ID
              let safeId = Date.now();
              if (remoteUser.nameID && !isNaN(parseInt(remoteUser.nameID))) {
                safeId = parseInt(remoteUser.nameID);
              }

              // If we have a stored worker_id, PREFER THAT even if we are in the fallback flow
              // caused by missing token in storage (but valid session)
              const storedWorkerId = await storage.get('worker_id');
              if (storedWorkerId && !isNaN(parseInt(storedWorkerId))) {
                console.log(`✅ Using stored worker_id (${storedWorkerId}) for SAML user.`);
                safeId = parseInt(storedWorkerId);
              }

              // For now, use the legacy mapping
              mappedUser = mapWorkerToUser({
                ...remoteUser,
                id: safeId,
                firstName: remoteUser.name,
                fullName: remoteUser.name
              });
            } else if (remoteUser.role === 'establishment') {
              mappedUser = mapEstablishmentToUser({
                ...remoteUser,
                establishmentId: remoteUser.establishmentId,
                establishmentName: remoteUser.name
              });
            } else if (remoteUser.role === 'department') {
              mappedUser = mapDepartmentToUser({
                ...remoteUser,
                departmentRoleId: remoteUser.departmentRoleId,
                roleName: remoteUser.name
              });
            }

            if (mappedUser) {
              login(mappedUser);
              restored = true;

              // If it was a worker, maybe try to fetch profile NOW to get better data?
              if (mappedUser.type === 'worker') {
                // attempt update
                try {
                  const profileResponse = await getWorkerProfile(mappedUser.id);
                  if (profileResponse?.data) {
                    // Update with rich data
                    // ... (similar mapping as above, omitted for brevity but recommended)
                  }
                } catch (e) {/* ignore */ }
              }
            }
          }
        } catch (serverError) {
          // If backend returns 401, that's fine, we are just not logged in.
          console.warn("⚠️ Failed to fetch remote user (not logged in):", serverError);
          if (!restored) {
            // ensure clean state
            await logout();
          }
        }

      } catch (error) {
        console.error("Auth init error", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auto-logout effect
  useEffect(() => {
    if (!user) return;

    const expiryTime = Number(localStorage.getItem("authExpiry"));
    const remaining = expiryTime - Date.now();

    const timer = setTimeout(() => {
      logout();
    }, remaining > 0 ? remaining : 0);

    return () => clearTimeout(timer);
  }, [user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};