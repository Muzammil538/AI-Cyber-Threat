import { useState, useEffect } from 'react';
import {
  AlertCircle,
  Shield,
  Activity,
  Settings,
  Search,
  Clock,
  Server,
  Users,
  AlertTriangle,
  BarChart2,
  List,
  ChevronDown,
  Info
} from 'lucide-react';


// Mock data for threats
// const mockThreats = [
//   { 
//     id: 1, 
//     type: 'Ransomware', 
//     severity: 'Critical', 
//     source: '192.168.1.45', 
//     target: 'File Server', 
//     timestamp: '2025-05-18T10:23:15',
//     details: 'Potential ransomware activity detected. Multiple encryption operations observed.',
//     status: 'Active'
//   },
//   { 
//     id: 2, 
//     type: 'Brute Force', 
//     severity: 'High', 
//     source: '203.45.67.89', 
//     target: 'Auth Gateway', 
//     timestamp: '2025-05-18T09:45:22',
//     details: 'Multiple failed login attempts from external IP.',
//     status: 'Active' 
//   },
//   { 
//     id: 3, 
//     type: 'Data Exfiltration', 
//     severity: 'High', 
//     source: '172.16.32.12', 
//     target: 'Database Server', 
//     timestamp: '2025-05-18T08:17:03',
//     details: 'Unusual data transfer patterns detected from internal database.',
//     status: 'Investigating'
//   },
//   { 
//     id: 4, 
//     type: 'Phishing', 
//     severity: 'Medium', 
//     source: 'Email Gateway', 
//     target: 'Multiple Users', 
//     timestamp: '2025-05-18T07:30:56',
//     details: 'Suspicious email campaign targeting financial department.',
//     status: 'Contained'
//   },
// ]


export default function ThreatMonitoringDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeThreat, setActiveThreat] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThreats() {
      setLoading(true);
      try {
        // No authentication needed
        const res = await fetch('http://localhost:8000/alerts');
        if (!res.ok) throw new Error('Failed to fetch threats');
        const data = await res.json();
        setThreats(data);
        console.log("Fetched threats:", data);
      } catch (err) {
        console.error(err);
        setThreats([]);
      }
      setLoading(false);
    }
    fetchThreats();
  }, []);

  const activeThreats = threats.filter(
  t =>
    (t.status === 'Active' || t.status === 'Investigating') &&
    (t.severity === 'Critical' || t.severity === 'High')
);

  const threatMetrics = {
    total: threats.length,
    critical: threats.filter(t => t.severity === 'Critical').length,
    high: threats.filter(t => t.severity === 'High').length,
    medium: threats.filter(t => t.severity === 'Medium').length,
    low: threats.filter(t => t.severity === 'Low').length,
    newToday: threats.filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString()).length,
    investigationPending: threats.filter(t => t.status === 'Investigating').length,
    resolved: threats.filter(t => t.status === 'Resolved').length,
    active: activeThreats.length,
  };

  // Group by type for chart
  const threatsByType = Object.entries(
    threats.reduce((acc, t) => {
      const threatType = t.type || t.prediction || 'Unknown';
      acc[threatType] = (acc[threatType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Timeline events (example: use latest threats)
  const timelineEvents = threats
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
    .map(t => ({
      time: t.timestamp ? new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown',
      event: `${t.type || t.prediction || 'Unknown'} detected on ${t.target || 'Unknown'}`,
      severity: t.severity || (t.threat_level && t.threat_level.charAt(0).toUpperCase() + t.threat_level.slice(1)) || 'Unknown',
    }));

  // Function to determine severity class for styling
  const getSeverityClass = (severity) => {
    if (!severity) return 'unknown-class';
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to determine status class for styling
  const getStatusClass = (status) => {
    if (!status) return 'unknown-class';
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-orange-100 text-orange-800';
      case 'contained':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Simulated threat detection (would be replaced with real-time data)
  useEffect(() => {
    const timer = setTimeout(() => {
      const newThreat = {
        id: 6,
        type: 'Zero-Day Exploit',
        severity: 'Critical',
        source: '91.204.55.78',
        target: 'Web Application Server',
        timestamp: '2025-05-18T10:42:37',
        details: 'Unknown attack pattern detected. Possible zero-day exploit targeting application vulnerabilities.',
        status: 'Active'
      };

      // This would be an update from the backend in a real application
      console.log('New threat detected:', newThreat);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */ }
      <header className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">CyberSentinel AI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
            <span className="text-sm font-medium">AD</span>
          </div>
        </div>
      </header>

      {/* Navigation */ }
      <div className="flex bg-slate-700 text-slate-200 px-4">
        <button
          className={ `px-4 py-3 flex items-center ${activeTab === 'dashboard' ? 'border-b-2 border-blue-400' : ''}` }
          onClick={ () => setActiveTab('dashboard') }
        >
          <Activity className="h-4 w-4 mr-2" />
          Dashboard
        </button>
        <button
          className={ `px-4 py-3 flex items-center ${activeTab === 'threats' ? 'border-b-2 border-blue-400' : ''}` }
          onClick={ () => setActiveTab('threats') }
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Threats
        </button>
        <button
          className={ `px-4 py-3 flex items-center ${activeTab === 'assets' ? 'border-b-2 border-blue-400' : ''}` }
          onClick={ () => setActiveTab('assets') }
        >
          <Server className="h-4 w-4 mr-2" />
          Assets
        </button>
        <button
          className={ `px-4 py-3 flex items-center ${activeTab === 'settings' ? 'border-b-2 border-blue-400' : ''}` }
          onClick={ () => setActiveTab('settings') }
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </button>
      </div>

      {/* Main Content */ }
      <main className="flex-1 overflow-auto p-4">
        { activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Summary Cards */ }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow flex items-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Threats</p>
                  <h3 className="text-2xl font-bold">{ threatMetrics.active }</h3>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Today</p>
                  <h3 className="text-2xl font-bold">{ threatMetrics.newToday }</h3>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Investigation</p>
                  <h3 className="text-2xl font-bold">{ threatMetrics.investigationPending }</h3>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <h3 className="text-2xl font-bold">{ threatMetrics.resolved }</h3>
                </div>
              </div>
            </div>

            {/* Threat Chart and Timeline */ }
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Threat Type Distribution Chart (Left) */ }
              <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Threat Distribution</h3>
                <div className="flex flex-col space-y-4">
                  { threatsByType.map((item, index) => (
                    <div key={ index }>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{ item.name }</span>
                        <span>{ item.value }</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={ { width: `${(item.value / threatMetrics.total) * 100}%` } }
                        ></div>
                      </div>
                    </div>
                  )) }
                </div>
              </div>

              {/* Activity Timeline (Right) */ }
              <div className="bg-white p-4 rounded-lg shadow lg:col-span-3">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  { timelineEvents.map((event, index) => (
                    <div key={ index } className="flex items-start">
                      <div className={ `h-2 w-2 mt-2 rounded-full mr-2 ${event.severity === 'Critical' ? 'bg-red-500' :
                        event.severity === 'High' ? 'bg-orange-500' :
                          event.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }` }></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{ event.event }</p>
                          <span className="text-xs text-gray-500">{ event.time }</span>
                        </div>
                        <p className="text-xs text-gray-500">Severity: { event.severity }</p>
                      </div>
                    </div>
                  )) }
                </div>
              </div>
            </div>

            {/* Active Threats Table */ }
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Threats</h3>
                <div className="flex space-x-2">
                  <button
                    className={ `p-1 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}` }
                    onClick={ () => setViewMode('list') }
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    className={ `p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200' : ''}` }
                    onClick={ () => setViewMode('grid') }
                  >
                    <BarChart2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Table view */ }
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Severity</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Source</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Target</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { threats.filter(threat => (threat.status || '').toLowerCase() === 'active' ||
                      (threat.status || '').toLowerCase() === 'investigating').map((threat) => (
                        <tr key={ threat.id } className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{ threat.type || threat.prediction || 'Unknown' }</td>
                          <td className="px-4 py-3">
                            <span className={ `text-xs px-2 py-1 rounded-full font-medium ${getSeverityClass(threat.severity || (threat.threat_level && threat.threat_level.charAt(0).toUpperCase() + threat.threat_level.slice(1)))}` }>
                              { threat.severity || (threat.threat_level && threat.threat_level.charAt(0).toUpperCase() + threat.threat_level.slice(1)) || 'Unknown' }
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{ threat.source || 'Unknown' }</td>
                          <td className="px-4 py-3 text-sm">{ threat.target || 'Unknown' }</td>
                          <td className="px-4 py-3 text-sm">
                            { new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                          </td>
                          <td className="px-4 py-3">
                            <span className={ `text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(threat.status)}` }>
                              { threat.status }
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              onClick={ () => setActiveThreat(threat) }
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      )) }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) }

        { activeTab === 'threats' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Threat Management</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search threats..."
                      className="pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                  <select className="border rounded-lg px-4 py-2">
                    <option>All Severities</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <select className="border rounded-lg px-4 py-2">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Investigating</option>
                    <option>Contained</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Severity</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Source</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Target</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Detected</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { threats.map((threat) => (
                      <tr key={ threat.id } className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{ threat.id }</td>
                        <td className="px-4 py-3 text-sm">{ threat.type }</td>
                        <td className="px-4 py-3">
                          <span className={ `text-xs px-2 py-1 rounded-full font-medium ${getSeverityClass(threat.severity)}` }>
                            { threat.severity }
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{ threat.source }</td>
                        <td className="px-4 py-3 text-sm">{ threat.target }</td>
                        <td className="px-4 py-3 text-sm">
                          { new Date(threat.timestamp).toLocaleString() }
                        </td>
                        <td className="px-4 py-3">
                          <span className={ `text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(threat.status)}` }>
                            { threat.status }
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={ () => setActiveThreat(threat) }
                          >
                            Investigate
                          </button>
                        </td>
                      </tr>
                    )) }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) }

        { activeTab === 'assets' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Network Assets</h2>
            <p className="text-gray-500">Asset inventory and vulnerability management information would be displayed here.</p>
          </div>
        ) }

        { activeTab === 'settings' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">AI Engine Configuration</h3>
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Threat Detection Sensitivity</label>
                    <select className="w-full border rounded p-2">
                      <option>High (more alerts, potential false positives)</option>
                      <option selected>Medium (balanced approach)</option>
                      <option>Low (fewer alerts, focus on high confidence)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Learning Mode</label>
                    <div className="flex items-center">
                      <input type="checkbox" id="learning-mode" className="mr-2" checked />
                      <label htmlFor="learning-mode">Enable continuous learning from threats</label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Notifications</label>
                    <div className="flex items-center">
                      <input type="checkbox" id="email-critical" className="mr-2" checked />
                      <label htmlFor="email-critical">Critical threats</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="email-high" className="mr-2" checked />
                      <label htmlFor="email-high">High severity threats</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="email-medium" className="mr-2" />
                      <label htmlFor="email-medium">Medium severity threats</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">SMS Notifications</label>
                    <div className="flex items-center">
                      <input type="checkbox" id="sms-critical" className="mr-2" checked />
                      <label htmlFor="sms-critical">Critical threats only</label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">API Integration</h3>
                <div className="border rounded-lg p-4">
                  <p className="text-sm mb-2">API Key:</p>
                  <div className="flex items-center">
                    <input type="password" value="••••••••••••••••••••••••••••••" className="border rounded p-2 flex-1 mr-2" readOnly />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Regenerate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) }
      </main>

      {/* Threat Detail Modal */ }
      { activeThreat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{ activeThreat.type } Threat</h2>
                  <div className="flex space-x-2 mt-1">
                    <span className={ `text-xs px-2 py-1 rounded-full font-medium ${getSeverityClass(activeThreat.severity)}` }>
                      { activeThreat.severity }
                    </span>
                    <span className={ `text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(activeThreat.status)}` }>
                      { activeThreat.status }
                    </span>
                  </div>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={ () => setActiveThreat(null) }
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">Threat Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">ID:</span>
                      <span className="text-sm font-medium">{ activeThreat.id }</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Source:</span>
                      <span className="text-sm font-medium">{ activeThreat.source }</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Target:</span>
                      <span className="text-sm font-medium">{ activeThreat.target }</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Detected:</span>
                      <span className="text-sm font-medium">{ new Date(activeThreat.timestamp).toLocaleString() }</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">AI Analysis</h3>
                  <p className="text-sm">{ activeThreat.details }</p>
                  <div className="mt-4">
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-500 mr-2">Confidence Score:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={ { width: '85%' } }
                        ></div>
                      </div>
                      <span className="text-sm font-medium ml-2">85%</span>
                    </div>
                    <p className="text-xs text-gray-500">Pattern matched with 3 similar attacks in the last 30 days</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="font-medium mb-3">Affected Systems</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium">{ activeThreat.target }</span>
                    </div>
                    <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded">Compromised</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium">Auth Gateway</span>
                    </div>
                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded">At Risk</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium">Network Storage (NAS-01)</span>
                    </div>
                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded">At Risk</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-3">Recommended Actions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center mr-2">
                        <span className="text-red-600 text-xs">1</span>
                      </div>
                      <span>Isolate affected server from network immediately</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                        <span className="text-orange-600 text-xs">2</span>
                      </div>
                      <span>Block source IP { activeThreat.source } at firewall</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                        <span className="text-yellow-600 text-xs">3</span>
                      </div>
                      <span>Scan all at-risk systems for indicators of compromise</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="text-blue-600 text-xs">4</span>
                      </div>
                      <span>Restore affected systems from latest clean backup</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-3">MITRE ATT&CK Mapping</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Initial Access</span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">T1190 - Exploit Public-Facing Application</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Execution</span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">T1059 - Command and Scripting Interpreter</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Persistence</span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">T1136 - Create Account</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Impact</span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">T1486 - Data Encrypted for Impact</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="font-medium mb-3">Event Timeline</h3>
                <div className="relative pl-8 border-l-2 border-gray-200 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm font-medium">Initial Access Detected</p>
                      <p className="text-xs text-gray-500">
                        { new Date(new Date(activeThreat.timestamp).getTime() - 1200000).toLocaleString() }
                      </p>
                      <p className="text-sm mt-1">Exploit attempt detected against vulnerable web application</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-orange-500"></div>
                    <div>
                      <p className="text-sm font-medium">Lateral Movement</p>
                      <p className="text-xs text-gray-500">
                        { new Date(new Date(activeThreat.timestamp).getTime() - 600000).toLocaleString() }
                      </p>
                      <p className="text-sm mt-1">Suspicious authentication to multiple systems detected</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm font-medium">Malicious Activity</p>
                      <p className="text-xs text-gray-500">{ new Date(activeThreat.timestamp).toLocaleString() }</p>
                      <p className="text-sm mt-1">{ activeThreat.details }</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 justify-end">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium">
                  Export Report
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium"
                  onClick={ async () => {
                    if (!activeThreat?.id) return;
                    try {
                      const res = await fetch(`http://localhost:8000/threats/${activeThreat.id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Investigating' })
                      });
                      if (res.ok) {
                        setThreats(threats =>
                          threats.map(t =>
                            t.id === activeThreat.id ? { ...t, status: 'Investigating' } : t
                          )
                        );
                        setActiveThreat({ ...activeThreat, status: 'Investigating' });
                        alert('Threat status updated to Investigating.');
                      } else {
                        alert('Failed to update threat status.');
                      }
                    } catch (err) {
                      alert('Error updating threat status.', err);
                    }
                  } }
                  disabled={ activeThreat?.status === 'Investigating' || activeThreat?.status === 'Resolved' }
                >
                  Take Action
                </button>
                { activeThreat?.status === 'Investigating' && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium"
                    onClick={ async () => {
                      if (!activeThreat?.id) return;
                      try {
                        const res = await fetch(`http://localhost:8000/threats/${activeThreat.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'Resolved' })
                        });
                        if (res.ok) {
                          setThreats(threats =>
                            threats.map(t =>
                              t.id === activeThreat.id ? { ...t, status: 'Resolved' } : t
                            )
                          );
                          setActiveThreat({ ...activeThreat, status: 'Resolved' });
                          alert('Threat status updated to Resolved.');
                        } else {
                          alert('Failed to update threat status.');
                        }
                      } catch (err) {
                        alert('Error updating threat status.', err);
                      }
                    } }
                  >
                    Resolve
                  </button>
                ) }
              </div>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
}