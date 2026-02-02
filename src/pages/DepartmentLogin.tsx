import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import { departmentLogin } from '../api/api';
import toast from 'react-hot-toast';

const DepartmentLogin: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // username: '',
    password: '',
    // role: '',
    emailId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // if (!formData.username.trim()) {
    //   newErrors.username = t('forms.validation.required');
    // }
    if (!formData.emailId.trim()) {
      newErrors.emailId = t('forms.validation.required');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('forms.validation.required');
    }

    // if (!formData.role) {
    //   newErrors.role = t('forms.validation.required');
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setIsLoading(true);

  // Simulate API call
  //     setTimeout(() => {
  //       // Mock successful login
  //       const roleLabel = departmentRoles.find(r => r.value === formData.role)?.label || formData.role;
  //      login({
  //   departmentUserId: user.departmentUserId,
  //   type: "department",
  //   roleName: user.roleName,
  //   roleDescription: user.roleDescription,
  //   emailId: user.emailId,
  //   contactNumber: user.contactNumber,
  //   lastLoggedIn: user.lastLoggedIn,
  // });

  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await departmentLogin(formData);
      console.log("Login successful:", data);
      toast.success("Welcome back! Login successful.");
      login({
        type: "department",
        departmentRoleId: data.departmentRoleId,
        roleName: data.roleName,
        roleDescription: data.roleDescription,
        emailId: data.emailId,
        contactNumber: data.contactNumber,
        lastLoggedIn: data.lastLoggedIn,
        departmentUserId: data.departmentUserId
      });

      localStorage.setItem('role', 'department');
      navigate("/dashboard/department");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Invalid credentials or server error";
      toast.error(errorMsg);
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t('landing.loginAsDepartment')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('department.login')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="space-y-4">
              <FormInput
                label={t("establishment.emailAddress")}
                type="email"
                value={formData.emailId}
                onChange={(value) =>
                  setFormData({ ...formData, emailId: value })
                }
                required
                error={errors.emailId}
                autoComplete='new-email'
                leftIcon={<Mail className="h-5 w-5" />}
              />

              <FormInput
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                placeholder={t('auth.password')}
                required
                error={errors.password}
                autoComplete='new-password'
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {t('navigation.login')} {t('common.as')}{' '}
            <Link to="/login/worker" className="text-green-600 hover:text-green-700">
              {t('worker.login')}
            </Link>
            {' '}{t('common.or')}{' '}
            <Link to="/login/establishment" className="text-orange-600 hover:text-orange-700">
              {t('establishment.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLogin;