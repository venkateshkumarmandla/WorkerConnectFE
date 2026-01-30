import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, Phone, Mail, MapPin, Briefcase, Calendar, FileText, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth, WorkerUser } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import { DISTRICTS, TRADES_OF_WORK, WORKER_CATEGORIES } from '../utils/constants';

const WorkerProfile: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const worker = user as WorkerUser | undefined;

  const [isEditing, setIsEditing] = useState(false);

  // Initialize with Auth Data or Fallback
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: worker?.firstName || '',
    middleName: worker?.middleName || '',
    lastName: worker?.lastName || '',
    gender: worker?.gender || '',
    dateOfBirth: worker?.dateOfBirth || '',
    age: worker?.age?.toString() || '',
    maritalStatus: worker?.maritalStatus || '',
    fatherHusbandName: '', // Not in provided JSON?
    caste: worker?.caste || '',
    subCaste: worker?.subCaste || '',

    // Contact Information
    mobileNumber: worker?.mobileNumber?.toString() || '',
    alternateNumber: '',
    emailAddress: worker?.emailId || '',

    // Address Information
    presentAddress: {
      doorNumber: worker?.presentAddress?.doorNumber || '',
      street: worker?.presentAddress?.street || '',
      district: worker?.presentAddress?.district || '',
      mandal: '', // Need to map if available
      village: '',
      pincode: worker?.presentAddress?.pincode?.toString() || ''
    },

    // Work Information
    employerName: worker?.establishmentName || '',
    constructionOrg: '',
    tradeOfWork: '',
    workerCategory: '',
    workExperience: '',

    // Registration Information
    registrationId: '', // worker.id?
    registrationDate: '',
    aadhaarNumber: worker?.aadhaarNumber || '',
    eSharmId: worker?.eSharmId || '',
    boCWId: worker?.boCwId || '',

    // Bank Information
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branchName: ''

  });

  // Sync state with User Context when it loads
  useEffect(() => {
    if (worker) {
      console.log('👤 Profile Page: Syncing user data to state', worker);
      setProfileData(prev => ({
        ...prev,
        firstName: worker.firstName || '',
        middleName: worker.middleName || '',
        lastName: worker.lastName || '',
        gender: worker.gender || '',
        dateOfBirth: worker.dateOfBirth || '',
        age: worker.age?.toString() || '',
        maritalStatus: worker.maritalStatus || '',
        caste: worker.caste || '',
        subCaste: worker.subCaste || '',

        mobileNumber: worker.mobileNumber?.toString() || '',
        emailAddress: worker.emailId || '',

        presentAddress: {
          doorNumber: worker.presentAddress?.doorNumber || '',
          street: worker.presentAddress?.street || '',
          district: worker.presentAddress?.district || '',
          mandal: '',
          village: '',
          pincode: worker.presentAddress?.pincode?.toString() || ''
        },

        employerName: worker.establishmentName || '',

        aadhaarNumber: worker.aadhaarNumber || '',
        eSharmId: worker.eSharmId || '',
        boCWId: worker.boCwId || ''
      }));
    }
  }, [worker]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const districtOptions = DISTRICTS.map(district => ({
    value: district.name.toLowerCase().replace(/\s+/g, '_'),
    label: district.name
  }));

  const tradeOptions = TRADES_OF_WORK.map(trade => ({
    value: trade.toLowerCase().replace(/\s+/g, '_'),
    label: trade
  }));

  const categoryOptions = WORKER_CATEGORIES.map(category => ({
    value: category.toLowerCase().replace(/-/g, '_'),
    label: category
  }));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = () => {
    // Validate form data
    const newErrors: Record<string, string> = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Save profile data
      console.log('Saving profile data:', profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="card-mobile mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm">{label}:</span>
      <span className="text-gray-900 font-medium text-sm">{value || 'Not provided'}</span>
    </div>
  );

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card-mobile mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.middleName} {profileData.lastName}
                </h1>
                <p className="text-gray-600">Registration ID: {profileData.registrationId}</p>
                <p className="text-sm text-green-600 font-medium">Active Worker</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <ProfileSection title="Personal Information">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(value) => setProfileData({ ...profileData, firstName: value })}
                    error={errors.firstName}
                  />
                  <FormInput
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(value) => setProfileData({ ...profileData, lastName: value })}
                    error={errors.lastName}
                  />
                </div>
                <FormInput
                  label="Middle Name"
                  value={profileData.middleName}
                  onChange={(value) => setProfileData({ ...profileData, middleName: value })}
                />
                <FormInput
                  label="Father/Husband Name"
                  value={profileData.fatherHusbandName}
                  onChange={(value) => setProfileData({ ...profileData, fatherHusbandName: value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Date of Birth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(value) => setProfileData({ ...profileData, dateOfBirth: value })}
                  />
                  <FormInput
                    label="Age"
                    value={profileData.age}
                    onChange={(value) => setProfileData({ ...profileData, age: value })}
                    disabled
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <InfoRow label="Full Name" value={`${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`} />
                <InfoRow label="Father/Husband Name" value={profileData.fatherHusbandName} />
                <InfoRow label="Date of Birth" value={profileData.dateOfBirth} />
                <InfoRow label="Age" value={`${profileData.age} years`} />
                <InfoRow label="Gender" value={profileData.gender} />
                <InfoRow label="Marital Status" value={profileData.maritalStatus} />
                <InfoRow label="Caste" value={profileData.caste} />
                <InfoRow label="Sub Caste" value={profileData.subCaste} />
              </div>
            )}
          </ProfileSection>

          {/* Contact Information */}
          <ProfileSection title="Contact Information">
            {isEditing ? (
              <div className="space-y-4">
                <FormInput
                  label="Mobile Number"
                  value={profileData.mobileNumber}
                  onChange={(value) => setProfileData({ ...profileData, mobileNumber: value })}
                  error={errors.mobileNumber}
                />
                <FormInput
                  label="Alternate Number"
                  value={profileData.alternateNumber}
                  onChange={(value) => setProfileData({ ...profileData, alternateNumber: value })}
                />
                <FormInput
                  label="Email Address"
                  type="email"
                  value={profileData.emailAddress}
                  onChange={(value) => setProfileData({ ...profileData, emailAddress: value })}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <InfoRow label="Mobile Number" value={profileData.mobileNumber} />
                <InfoRow label="Alternate Number" value={profileData.alternateNumber} />
                <InfoRow label="Email Address" value={profileData.emailAddress} />
              </div>
            )}
          </ProfileSection>

          {/* Address Information */}
          <ProfileSection title="Address Information">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Door Number"
                    value={profileData.presentAddress.doorNumber}
                    onChange={(value) => setProfileData({
                      ...profileData,
                      presentAddress: { ...profileData.presentAddress, doorNumber: value }
                    })}
                  />
                  <FormInput
                    label="Street"
                    value={profileData.presentAddress.street}
                    onChange={(value) => setProfileData({
                      ...profileData,
                      presentAddress: { ...profileData.presentAddress, street: value }
                    })}
                  />
                </div>
                <FormSelect
                  label="District"
                  value={profileData.presentAddress.district}
                  onChange={(value) => setProfileData({
                    ...profileData,
                    presentAddress: { ...profileData.presentAddress, district: value }
                  })}
                  options={districtOptions}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Mandal/City"
                    value={profileData.presentAddress.mandal}
                    onChange={(value) => setProfileData({
                      ...profileData,
                      presentAddress: { ...profileData.presentAddress, mandal: value }
                    })}
                  />
                  <FormInput
                    label="Pincode"
                    value={profileData.presentAddress.pincode}
                    onChange={(value) => setProfileData({
                      ...profileData,
                      presentAddress: { ...profileData.presentAddress, pincode: value }
                    })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <InfoRow label="Door Number" value={profileData.presentAddress.doorNumber} />
                <InfoRow label="Street" value={profileData.presentAddress.street} />
                <InfoRow label="District" value={profileData.presentAddress.district} />
                <InfoRow label="Mandal/City" value={profileData.presentAddress.mandal} />
                <InfoRow label="Village/Area" value={profileData.presentAddress.village} />
                <InfoRow label="Pincode" value={profileData.presentAddress.pincode} />
              </div>
            )}
          </ProfileSection>

          {/* Work Information */}
          <ProfileSection title="Work Information">
            {isEditing ? (
              <div className="space-y-4">
                <FormInput
                  label="Employer Name"
                  value={profileData.employerName}
                  onChange={(value) => setProfileData({ ...profileData, employerName: value })}
                />
                <FormInput
                  label="Construction Organisation"
                  value={profileData.constructionOrg}
                  onChange={(value) => setProfileData({ ...profileData, constructionOrg: value })}
                />
                <FormSelect
                  label="Trade of Work"
                  value={profileData.tradeOfWork}
                  onChange={(value) => setProfileData({ ...profileData, tradeOfWork: value })}
                  options={tradeOptions}
                />
                <FormSelect
                  label="Worker Category"
                  value={profileData.workerCategory}
                  onChange={(value) => setProfileData({ ...profileData, workerCategory: value })}
                  options={categoryOptions}
                />
                <FormInput
                  label="Work Experience (Years)"
                  value={profileData.workExperience}
                  onChange={(value) => setProfileData({ ...profileData, workExperience: value })}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <InfoRow label="Employer Name" value={profileData.employerName} />
                <InfoRow label="Construction Organisation" value={profileData.constructionOrg} />
                <InfoRow label="Trade of Work" value={profileData.tradeOfWork} />
                <InfoRow label="Worker Category" value={profileData.workerCategory} />
                <InfoRow label="Work Experience" value={`${profileData.workExperience} years`} />
              </div>
            )}
          </ProfileSection>

          {/* Registration Information */}
          <ProfileSection title="Registration Information">
            <div className="space-y-1">
              <InfoRow label="Registration ID" value={profileData.registrationId} />
              <InfoRow label="Registration Date" value={profileData.registrationDate} />
              <InfoRow label="Aadhar Number" value={profileData.aadhaarNumber} />
              <InfoRow label="eShram ID" value={profileData.eSharmId} />
              <InfoRow label="BoCW ID" value={profileData.boCWId} />
            </div>
          </ProfileSection>

          {/* Bank Information */}
          <ProfileSection title="Bank Information">
            {isEditing ? (
              <div className="space-y-4">
                <FormInput
                  label="Account Number"
                  value={profileData.accountNumber}
                  onChange={(value) => setProfileData({ ...profileData, accountNumber: value })}
                />
                <FormInput
                  label="Bank Name"
                  value={profileData.bankName}
                  onChange={(value) => setProfileData({ ...profileData, bankName: value })}
                />
                <FormInput
                  label="IFSC Code"
                  value={profileData.ifscCode}
                  onChange={(value) => setProfileData({ ...profileData, ifscCode: value })}
                />
                <FormInput
                  label="Branch Name"
                  value={profileData.branchName}
                  onChange={(value) => setProfileData({ ...profileData, branchName: value })}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <InfoRow label="Account Number" value={`****${profileData.accountNumber.slice(-4)}`} />
                <InfoRow label="Bank Name" value={profileData.bankName} />
                <InfoRow label="IFSC Code" value={profileData.ifscCode} />
                <InfoRow label="Branch Name" value={profileData.branchName} />
              </div>
            )}
          </ProfileSection>
        </div>

        {/* Quick Actions */}
        <div className="card-mobile mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <FileText className="h-5 w-5 mr-2" />
              View Documents
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <Calendar className="h-5 w-5 mr-2" />
              Attendance History
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <Camera className="h-5 w-5 mr-2" />
              Update Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;