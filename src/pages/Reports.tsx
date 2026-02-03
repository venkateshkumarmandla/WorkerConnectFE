import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Download, Calendar, FileText, TrendingUp, Users, Building2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api/api';
import { DUMMY_REPORT_DATA } from '../api/dummyData';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('worker_summary');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });
  const [filters, setFilters] = useState({
    district: 'all',
    status: 'all',
    category: 'all'
  });
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    {
      id: 'worker_summary',
      title: t('reports.workerSummary.title'),
      description: t('reports.workerSummary.description'),
      icon: Users
    },
    {
      id: 'establishment_summary',
      title: t('reports.establishmentSummary.title'),
      description: t('reports.establishmentSummary.description'),
      icon: Building2
    },
    {
      id: 'attendance_report',
      title: t('reports.attendanceReport.title'),
      description: t('reports.attendanceReport.description'),
      icon: Calendar
    },
    {
      id: 'compliance_report',
      title: t('reports.complianceReport.title'),
      description: t('reports.complianceReport.description'),
      icon: BarChart3
    },
    {
      id: 'registration_trends',
      title: t('reports.registrationTrends.title'),
      description: t('reports.registrationTrends.description'),
      icon: TrendingUp
    },
    {
      id: 'document_verification',
      title: t('reports.documentVerification.title'),
      description: t('reports.documentVerification.description'),
      icon: FileText
    }
  ];

  // Fetch report data from APIs
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        let data: any = null;

        if (selectedReport === 'worker_summary') {
          // Use departmentApi.getStats() which returns aggregated stats
          const stats = await import('../api/department').then(m => m.departmentApi.getStats());

          if (stats) {
            data = {
              totalWorkers: stats.totalWorkers || 0,
              activeWorkers: stats.workersPresent || 0,
              maleWorkers: 0,
              femaleWorkers: 0,
              skilledWorkers: 0,
              semiSkilledWorkers: 0,
              unskilledWorkers: 0,
              districtWise: []
            };
          }
        } else if (selectedReport === 'establishment_summary') {
          // Use departmentApi.getEstablishments()
          const establishments = await import('../api/department').then(m => m.departmentApi.getEstablishments());

          if (establishments) {
            data = {
              totalEstablishments: establishments.length,
              activeEstablishments: establishments.length, // Assuming all returned are active for now
              privateCommercial: 0,
              privateResidential: 0,
              stateGovernment: 0,
              centralGovernment: 0,
              totalProjectValue: 0,
              totalWorkers: establishments.reduce((acc, est) => acc + (est.totalWorkers || 0), 0)
            };
          }
        } else if (selectedReport === 'attendance_report') {
          const stats = await import('../api/department').then(m => m.departmentApi.getStats());

          if (stats) {
            data = {
              averageAttendance: stats.totalWorkers > 0 ? ((stats.workersPresent / stats.totalWorkers) * 100).toFixed(1) : 0,
              presentToday: stats.workersPresent || 0,
              absentToday: stats.workersAbsent || 0,
              monthlyTrend: []
            };
          }
        }

        // Apply dummy data if results are empty or incomplete
        if (!data || (selectedReport === 'worker_summary' && !data.totalWorkers)) {
          data = DUMMY_REPORT_DATA.worker_summary;
        } else if (!data || (selectedReport === 'establishment_summary' && !data.totalEstablishments)) {
          data = DUMMY_REPORT_DATA.establishment_summary;
        } else if (!data || (selectedReport === 'attendance_report' && !data.presentToday)) {
          data = DUMMY_REPORT_DATA.attendance_report;
        }

        setReportData(data);

      } catch (error) {
        console.error('Failed to fetch report data, using dummy data:', error);
        if (selectedReport === 'worker_summary') setReportData(DUMMY_REPORT_DATA.worker_summary);
        else if (selectedReport === 'establishment_summary') setReportData(DUMMY_REPORT_DATA.establishment_summary);
        else if (selectedReport === 'attendance_report') setReportData(DUMMY_REPORT_DATA.attendance_report);
        else setReportData({});
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedReport, dateRange, filters]);

  const generateReport = () => {
    // Simulate report generation
    // In a real app, this might trigger a re-fetch with new filters
    console.log(t('reports.common.loading'));
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!reportData) {
      alert(t('reports.common.noData'));
      return;
    }

    if (format === 'csv') {
      const title = reportTypes.find(r => r.id === selectedReport)?.title || 'Report';
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += `${title}\n\n`;

      // Helper to push key-value pair
      const addRow = (label: string, value: any) => {
        csvContent += `${label},${value}\n`;
      };

      if (selectedReport === 'worker_summary') {
        addRow(t('reports.stats.activeWorkers'), reportData.totalWorkers);
        addRow(t('reports.stats.activeWorkers'), reportData.activeWorkers);
        addRow(t('reports.stats.maleWorkers'), reportData.maleWorkers);
        addRow(t('reports.stats.femaleWorkers'), reportData.femaleWorkers);
        addRow(t('reports.stats.skilled'), reportData.skilledWorkers);
        addRow(t('reports.stats.semiSkilled'), reportData.semiSkilledWorkers);
        addRow(t('reports.stats.unskilled'), reportData.unskilledWorkers);
      } else if (selectedReport === 'establishment_summary') {
        addRow("Total Establishments", reportData.totalEstablishments);
        addRow("Active Establishments", reportData.activeEstablishments);
        addRow("Total Workers", reportData.totalWorkers);
      } else if (selectedReport === 'attendance_report') {
        addRow(t('reports.stats.avgAttendance'), reportData.averageAttendance + '%');
        addRow(t('reports.stats.presentToday'), reportData.presentToday);
        addRow(t('reports.stats.absentToday'), reportData.absentToday);
      } else {
        // Generic dump for other reports
        Object.entries(reportData).forEach(([key, value]) => {
          addRow(key, JSON.stringify(value));
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${selectedReport}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Placeholder for PDF/Excel which might require libraries
      alert(`Exporting as ${format.toUpperCase()} is coming soon.`);
    }
  };

  const renderReportPreview = () => {
    if (loading) {
      return <div className="text-center py-8 text-gray-500">{t('reports.common.loading')}</div>;
    }

    if (!reportData) {
      return <div className="text-center py-8 text-gray-500">{t('reports.common.noData')}</div>;
    }

    if (selectedReport === 'worker_summary') {
      const workerData = reportData;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{(workerData.totalWorkers || 0).toLocaleString()}</div>
              <div className="text-sm text-blue-700">{t('department.totalWorkers')}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{(workerData.activeWorkers || 0).toLocaleString()}</div>
              <div className="text-sm text-green-700">{t('reports.stats.activeWorkers')}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{(workerData.maleWorkers || 0).toLocaleString()}</div>
              <div className="text-sm text-purple-700">{t('reports.stats.maleWorkers')}</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{(workerData.femaleWorkers || 0).toLocaleString()}</div>
              <div className="text-sm text-pink-700">{t('reports.stats.femaleWorkers')}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">{t('reports.stats.skillDistribution')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('reports.stats.skilled')}</span>
                  <span className="text-sm font-medium">{(workerData.skilledWorkers || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('reports.stats.semiSkilled')}</span>
                  <span className="text-sm font-medium">{(workerData.semiSkilledWorkers || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('reports.stats.unskilled')}</span>
                  <span className="text-sm font-medium">{(workerData.unskilledWorkers || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">{t('reports.stats.topDistricts')}</h4>
              <div className="space-y-2">
                {(workerData.districtWise || []).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-gray-600">{item.district}</span>
                    <span className="text-sm font-medium">{(item.count || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedReport === 'establishment_summary') {
      const estData = reportData;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{(estData.totalEstablishments || 0).toLocaleString()}</div>
              <div className="text-sm text-orange-700">Total Establishments</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{(estData.activeEstablishments || 0).toLocaleString()}</div>
              <div className="text-sm text-green-700">Active</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">₹{((estData.totalProjectValue || 0) / 10000000).toFixed(0)}Cr</div>
              <div className="text-sm text-blue-700">{t('reports.stats.projectValue')}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{(estData.totalWorkers || 0).toLocaleString()}</div>
              <div className="text-sm text-purple-700">{t('department.totalWorkers')}</div>
            </div>
          </div>

          <div className="bg-white p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">{t('reports.stats.categoryDistribution')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{estData.privateCommercial || 0}</div>
                <div className="text-sm text-gray-600">Private Commercial</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{estData.privateResidential || 0}</div>
                <div className="text-sm text-gray-600">Private Residential</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{estData.stateGovernment || 0}</div>
                <div className="text-sm text-gray-600">State Government</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{estData.centralGovernment || 0}</div>
                <div className="text-sm text-gray-600">Central Government</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedReport === 'attendance_report') {
      const attData = reportData;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{attData.averageAttendance || 0}%</div>
              <div className="text-sm text-green-700">{t('reports.stats.avgAttendance')}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{(attData.presentToday || 0).toLocaleString()}</div>
              <div className="text-sm text-blue-700">{t('reports.stats.presentToday')}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{(attData.absentToday || 0).toLocaleString()}</div>
              <div className="text-sm text-red-700">{t('reports.stats.absentToday')}</div>
            </div>
          </div>

          <div className="bg-white p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">{t('reports.stats.monthlyTrend')}</h4>
            <div className="space-y-2">
              {(attData.monthlyTrend || []).map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${item.attendance || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.attendance || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{t('reports.common.selectReport')}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t('reports.title')}
          </h1>
          <p className="text-gray-600">
            {t('reports.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Types */}
          <div className="lg:col-span-1">
            <div className="card-mobile">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reports.reportTypes')}</h3>
              <div className="space-y-2">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedReport === report.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${selectedReport === report.id ? 'text-blue-600' : 'text-gray-500'
                          }`} />
                        <div>
                          <h4 className={`font-medium ${selectedReport === report.id ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                            {report.title}
                          </h4>
                          <p className={`text-sm ${selectedReport === report.id ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="card-mobile mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reports.filters')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('reports.dateRange')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('reports.district')}</label>
                  <select
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Districts</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="visakhapatnam">Visakhapatnam</option>
                    <option value="guntur">Guntur</option>
                    <option value="krishna">Krishna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('reports.status')}</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <button
                  onClick={generateReport}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('reports.generate')}
                </button>
              </div>
            </div>
          </div>

          {/* Report Preview */}
          <div className="lg:col-span-2">
            <div className="card-mobile">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {reportTypes.find(r => r.id === selectedReport)?.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportReport('pdf')}
                    className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportReport('excel')}
                    className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </button>
                  <button
                    onClick={() => exportReport('csv')}
                    className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </button>
                </div>
              </div>

              {renderReportPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;