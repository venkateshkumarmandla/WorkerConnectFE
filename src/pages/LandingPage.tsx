import React from 'react';
import { Users, Building2, Shield, CheckCircle, Smartphone, ArrowRight, Award, HardHat, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ResponsiveButton from '../components/ui/ResponsiveButton';
import ResponsiveCard from '../components/ui/ResponsiveCard';
import CBN from '../Images/cbn.jpg';
import Lokesh from '../Images/lokesh.jpg';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    t('landing.benefits.secure'),
    t('landing.benefits.multilang'),
    t('landing.benefits.realtime'),
    t('landing.benefits.reporting'),
    t('landing.benefits.mobile'),
    t('landing.benefits.compliance')
  ];

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section with Gradient Curve */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center">
        {/* Background Gradient Curve */}
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 rounded-bl-[100px] lg:rounded-bl-[250px] -z-10 shadow-2xl"></div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 w-full grid lg:grid-cols-2 gap-12 py-12 lg:py-20 relative z-10">
          {/* Left: Text & Title */}
          <div className="text-white space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-sm font-semibold tracking-wide uppercase">
              <Award className="w-4 h-4" />
              <span>{t('landing.subtitle')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter shadow-orange-50 text-orange-600">
              {t('landing.heroTitle')}
            </h1>

            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed max-w-xl font-bold">
              {t('landing.heroDescription')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <ResponsiveButton
                to="/register/worker"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-xl font-bold px-8 transition-transform hover:scale-105"
              >
                {t('landing.registerAsWorker')}
              </ResponsiveButton>
            </div>
          </div>

          {/* Right: Leader Photos */}
          <div className="flex flex-row items-start justify-center lg:justify-end gap-3 sm:gap-16 animate-in fade-in slide-in-from-right duration-700">
            {/* Primary Leader */}
            <div className="flex flex-col items-center group flex-1 max-w-[180px] sm:max-w-none">
              <div
                className="relative w-full aspect-[4/5] sm:w-64 sm:h-80 overflow-hidden transition-all duration-500 group-hover:scale-105"
                role="img"
                aria-label={t('leaders.cmAltText').replace('{0}', t('leaders.cmName'))}
              >
                <img src={CBN} alt={t('leaders.cmName')} className="w-full h-full object-contain object-center" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-orange-600 font-bold text-lg sm:text-xl tracking-tight leading-tight">{t('leaders.cmName')}</h3>
                <p className="text-black font-bold text-xs sm:text-base mt-1">{t('leaders.cmTitle')}</p>
                <p className="text-gray-600 text-[10px] sm:text-sm font-medium mt-0.5">
                  {t('leaders.cmGovt')}
                </p>
              </div>
            </div>

            {/* Secondary Leader */}
            <div className="flex flex-col items-center group flex-1 max-w-[180px] sm:max-w-none">
              <div
                className="relative w-full aspect-[4/5] sm:w-64 sm:h-80 overflow-hidden transition-all duration-500 group-hover:scale-105"
                role="img"
                aria-label={t('leaders.officialAltText').replace('{0}', t('leaders.officialName'))}
              >
                <img src={Lokesh} alt={t('leaders.officialName')} className="w-full h-full object-contain object-center" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-orange-600 font-bold text-lg sm:text-xl leading-tight tracking-tight">{t('leaders.officialName')}</h3>
                <p className="text-black font-bold text-xs sm:text-base mt-1">{t('leaders.officialTitle')}</p>
                <p className="text-gray-600 text-[10px] sm:text-sm font-medium mt-0.5">
                  {t('leaders.officialGovt')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {t('landing.quickAccess')}
            </h2>
            <div className="h-1.5 w-24 bg-orange-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 text-lg">
              {t('landing.quickAccessSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Worker Registration */}
            <ResponsiveCard
              to="/register/worker"
              icon={Users}
              iconColor="text-orange-600"
              title={t('landing.registerAsWorker')}
              description={t('landing.workerRegistrationDesc')}
              hover
              className="border-t-4 border-orange-600"
            >
              <div className="flex items-center text-orange-600 font-bold text-sm mt-4 group-hover:translate-x-2 transition-transform">
                <span>{t('common.start')}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </ResponsiveCard>

            {/* Establishment Registration */}
            <ResponsiveCard
              to="/register/establishment"
              icon={Building2}
              iconColor="text-red-600"
              title={t('landing.registerAsEstablishment')}
              description={t('landing.establishmentRegistrationDesc')}
              hover
              className="border-t-4 border-red-600"
            >
              <div className="flex items-center text-red-600 font-bold text-sm mt-4 group-hover:translate-x-2 transition-transform">
                <span>{t('common.start')}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </ResponsiveCard>

            {/* Mobile App Download */}
            <ResponsiveCard
              to="/mobile"
              icon={Smartphone}
              iconColor="text-blue-600"
              title={t('mobile.downloadApp')}
              description={t('mobile.getStarted')}
              hover
              className="border-t-4 border-blue-600"
            >
              <div className="flex items-center text-blue-600 font-bold text-sm mt-4 group-hover:translate-x-2 transition-transform">
                <span>{t('mobile.downloadApp')}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </ResponsiveCard>

            {/* Login Options Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-gray-800 p-6 flex flex-col">
              <div className="flex items-center mb-6">
                <Shield className="text-gray-800 mr-3 w-6 h-6" />
                <h3 className="font-extrabold text-gray-900 text-lg uppercase tracking-tight">
                  {t('landing.loginOptions')}
                </h3>
              </div>

              <div className="space-y-2.5">
                <Link
                  to="/login/worker"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 font-bold rounded-lg transition-all border border-transparent hover:border-orange-200 text-sm"
                >
                  <HardHat className="w-4 h-4" />
                  <span>{t('auth.citizenLogin')}</span>
                </Link>
                <Link
                  to="/login/establishment"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold rounded-lg transition-all border border-transparent hover:border-red-200 text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('landing.loginAsEstablishment')}</span>
                </Link>
                <Link
                  to="/login/department"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-bold rounded-lg transition-all border border-transparent hover:border-blue-200 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('auth.employeeLogin')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                {t('landing.whyChoose')}
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {t('landing.whyChooseSubtitle')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100 group hover:border-orange-200 transition-all">
                    <CheckCircle className="text-orange-600 mr-3 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium text-sm leading-snug">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-400 to-red-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-orange-200">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {t('landing.getStartedToday')}
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {t('landing.getStartedTodaySubtitle')}
                </p>
                <ResponsiveButton
                  to="/register"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 font-bold w-full"
                >
                  {t('landing.startRegistration')}
                </ResponsiveButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
