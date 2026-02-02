import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Edit, Save, X, Phone, MapPin, Calendar, Users, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';

const EstablishmentProfile: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    establishmentName: 'ABC Construction Ltd.',
    ownerName: 'Rajesh Kumar',
    emailAddress: 'contact@abcconstruction.com',
    mobileNumber: '9876543210',
    landlineNumber: '040-12345678',
    establishmentType: 'private_commercial',
    registrationNumber: 'REG123456789',
    gstNumber: '36ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    licenseNumber: 'LIC987654321',
    address: {
      doorNumber: '12-34',
      street: 'Construction Street',
      district: 'hyderabad',
      mandal: 'Secunderabad',
      village: 'Begumpet',
      pincode: '500016'
    },
    projectDetails: {
      projectName: 'Residential Complex Phase 1',
      estimatedCost: '50,00,00,000',
      commencementDate: '2024-01-15',
      completionDate: '2025-12-31',
      maleWorkers: '45',
      femaleWorkers: '15'
    }
  });

  const establishmentTypes = [
    { value: 'state_government', label: 'State Government' },
    { value: 'central_government', label: 'Central Government' },
    { value: 'private_residential', label: 'Private Residential' },
    { value: 'private_commercial', label: 'Private Commercial' }
  ];

  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('dashboard.invalidFormat'));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('dashboard.sizeExceeded'));
      return;
    }

    setUploading(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, you would upload to server and get back URL
      const fakeUrl = URL.createObjectURL(file);
      // We would update the user context here in a real app
      toast.success(t('dashboard.imageUploadSuccess'));
      setUploading(false);
    }, 1500);
  };

  const handleSave = () => {
    // In real app, save to API
    console.log('Saving profile:', formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const InfoCard = ({ icon: Icon, title, children }: any) => (
    <div className="card-mobile">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, field, type = 'text' }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {isEditing ? (
        <div className="w-48">
          {type === 'select' ? (
            <FormSelect
              label=""
              value={value}
              onChange={(newValue) => setFormData({ ...formData, [field]: newValue })}
              options={establishmentTypes}
              className="text-sm"
            />
          ) : (
            <FormInput
              label=""
              type={type}
              value={value}
              onChange={(newValue) => setFormData({ ...formData, [field]: newValue })}
              className="text-sm"
            />
          )}
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-sm">{value || 'Not provided'}</span>
      )}
    </div>
  );

  const AddressRow = ({ label, value, field }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {isEditing ? (
        <div className="w-48">
          <FormInput
            label=""
            value={value}
            onChange={(newValue) => setFormData({
              ...formData,
              address: { ...formData.address, [field]: newValue }
            })}
            className="text-sm"
          />
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-sm">{value || 'Not provided'}</span>
      )}
    </div>
  );

  const ProjectRow = ({ label, value, field, type = 'text' }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {isEditing ? (
        <div className="w-48">
          <FormInput
            label=""
            type={type}
            value={value}
            onChange={(newValue) => setFormData({
              ...formData,
              projectDetails: { ...formData.projectDetails, [field]: newValue }
            })}
            className="text-sm"
          />
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-sm">{value || 'Not provided'}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back') || 'Back'}
        </button>
        {/* Header and Logo Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex items-center justify-center overflow-hidden">
                {user?.type === 'establishment' && user.logoUrl ? (
                  <img src={user.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <Building2 className="h-12 w-12 text-orange-300" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-orange-700 transition-colors">
                <Edit className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleLogoUpload} />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {t('establishment.profile')}
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                {t('leaders.logoHelperText')}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 font-bold transition-all"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('common.save')}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common.cancel')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-100 font-bold transition-all"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('common.edit')}
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <InfoCard icon={Building2} title={t('establishment.establishmentDetails')}>
            <div className="space-y-1">
              <InfoRow
                label={t('establishment.establishmentName')}
                value={formData.establishmentName}
                field="establishmentName"
              />
              <InfoRow
                label={t('establishment.ownerName')}
                value={formData.ownerName}
                field="ownerName"
              />
              <InfoRow
                label={t('establishment.establishmentType')}
                value={formData.establishmentType}
                field="establishmentType"
                type="select"
              />
            </div>
          </InfoCard>

          {/* Contact Information */}
          <InfoCard icon={Phone} title={t('worker.contactDetails')}>
            <div className="space-y-1">
              <InfoRow
                label={t('establishment.emailAddress')}
                value={formData.emailAddress}
                field="emailAddress"
                type="email"
              />
              <InfoRow
                label={t('establishment.mobileNumber')}
                value={formData.mobileNumber}
                field="mobileNumber"
                type="tel"
              />
              <InfoRow
                label={t('establishment.landlineNumber')}
                value={formData.landlineNumber}
                field="landlineNumber"
                type="tel"
              />
            </div>
          </InfoCard>

          {/* Registration Details */}
          <InfoCard icon={FileText} title="Registration Details">
            <div className="space-y-1">
              <InfoRow
                label={t('establishment.registrationNumber')}
                value={formData.registrationNumber}
                field="registrationNumber"
              />
              <InfoRow
                label={t('establishment.gstNumber')}
                value={formData.gstNumber}
                field="gstNumber"
              />
              <InfoRow
                label={t('establishment.panNumber')}
                value={formData.panNumber}
                field="panNumber"
              />
              <InfoRow
                label={t('establishment.licenseNumber')}
                value={formData.licenseNumber}
                field="licenseNumber"
              />
            </div>
          </InfoCard>

          {/* Address Information */}
          <InfoCard icon={MapPin} title={t('worker.addressDetails')}>
            <div className="space-y-1">
              <AddressRow
                label={t('worker.doorNumber')}
                value={formData.address.doorNumber}
                field="doorNumber"
              />
              <AddressRow
                label={t('worker.street')}
                value={formData.address.street}
                field="street"
              />
              <AddressRow
                label={t('worker.district')}
                value={formData.address.district}
                field="district"
              />
              <AddressRow
                label={t('worker.mandal')}
                value={formData.address.mandal}
                field="mandal"
              />
              <AddressRow
                label={t('worker.village')}
                value={formData.address.village}
                field="village"
              />
              <AddressRow
                label={t('worker.pincode')}
                value={formData.address.pincode}
                field="pincode"
              />
            </div>
          </InfoCard>

          {/* Project Details */}
          <InfoCard icon={Calendar} title={t('establishment.projectDetails')}>
            <div className="space-y-1">
              <ProjectRow
                label={t('establishment.projectName')}
                value={formData.projectDetails.projectName}
                field="projectName"
              />
              <ProjectRow
                label={t('establishment.estimatedCost')}
                value={formData.projectDetails.estimatedCost}
                field="estimatedCost"
              />
              <ProjectRow
                label={t('establishment.commencementDate')}
                value={formData.projectDetails.commencementDate}
                field="commencementDate"
                type="date"
              />
              <ProjectRow
                label={t('establishment.completionDate')}
                value={formData.projectDetails.completionDate}
                field="completionDate"
                type="date"
              />
            </div>
          </InfoCard>

          {/* Worker Statistics */}
          <InfoCard icon={Users} title="Worker Statistics">
            <div className="space-y-1">
              <ProjectRow
                label={t('establishment.maleWorkers')}
                value={formData.projectDetails.maleWorkers}
                field="maleWorkers"
                type="number"
              />
              <ProjectRow
                label={t('establishment.femaleWorkers')}
                value={formData.projectDetails.femaleWorkers}
                field="femaleWorkers"
                type="number"
              />
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm font-medium">Total Workers:</span>
                <span className="text-gray-900 font-medium text-sm">
                  {parseInt(formData.projectDetails.maleWorkers || '0') +
                    parseInt(formData.projectDetails.femaleWorkers || '0')}
                </span>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Worker Management</h3>
            <p className="text-sm text-gray-600">Manage registered workers</p>
          </button>

          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Documents</h3>
            <p className="text-sm text-gray-600">View and update documents</p>
          </button>

          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Reports</h3>
            <p className="text-sm text-gray-600">Generate compliance reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentProfile;