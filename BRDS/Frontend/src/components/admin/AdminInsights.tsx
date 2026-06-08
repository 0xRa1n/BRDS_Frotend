import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function AdminInsights() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.admin.getRequests("All");
        setRequests(res.data || []);
      } catch (error) {
        console.error("Failed to load insights", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
        borderRadius: 4,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
      }
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 13, family: 'Inter, sans-serif' },
          color: '#374151',
        },
        border: { display: false }
      }
    }
  };

  let mostRequested = "None";
  let mostRequestedCount = 0;

  const documentCounts = requests.reduce((acc: Record<string, number>, req: any) => {
    if (req.document_type) {
      const docType = req.document_type.charAt(0).toUpperCase() + req.document_type.slice(1);
      acc[docType] = (acc[docType] || 0) + 1;
    }
    return acc;
  }, {});

  Object.entries(documentCounts).forEach(([docType, count]) => {
    if (count > mostRequestedCount) {
      mostRequestedCount = count;
      mostRequested = docType;
    }
  });

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status?.toLowerCase() === 'pending' || r.status?.toLowerCase() === 'under review').length;
  const pendingPercentage = totalRequests > 0 ? Math.round((pendingRequests / totalRequests) * 100) : 0;

  const labels = Object.keys(documentCounts).length > 0 ? Object.keys(documentCounts) : ['No Data'];
  const chartDataValues = Object.keys(documentCounts).length > 0 ? Object.values(documentCounts) : [0];

  const data = {
    labels,
    datasets: [
      {
        label: 'Requests',
        data: chartDataValues,
        backgroundColor: '#10b981', // emerald-500
        borderColor: '#10b981',
        barThickness: 12,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Document Requests by Type
          </h3>
          <select className="text-sm border border-gray-200 rounded-md px-3 py-1.5 text-gray-700 outline-none focus:border-emerald-500">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-[250px] w-full overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 font-medium">Loading chart data...</span>
            </div>
          ) : (
            <div className="h-full w-full animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards">
              <Bar options={options} data={data} />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Insights</h3>
        <div className="space-y-6 flex-1">
          {isLoading ? (
            <div className="w-full h-full animate-pulse flex flex-col gap-6">
              <div className="h-16 bg-gray-50 rounded-lg w-full"></div>
              <div className="h-16 bg-gray-50 rounded-lg w-full"></div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards space-y-6">
              <div className="relative pl-6">
                <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Most Requested</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-800">{mostRequested}</span> is currently the most requested document with {mostRequestedCount} requests.
                </p>
              </div>
              <div className="relative pl-6">
                <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Queue Status</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {pendingPercentage}% of all document requests ({pendingRequests} total) are currently waiting for review or approval.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
