import React, { useState } from 'react';
import { X, AlertCircle, Shield, Clock, Terminal, Server, Router, User, ArrowRight } from 'lucide-react';

// ThreatDetailModal component to display comprehensive information about a selected threat
export default function ThreatDetailModal({ threat, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  // If no threat is provided, don't render anything
  if (!threat) return null;

  // Severity level styling
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Sample mitigation steps based on threat type
  const getMitigationSteps = (type) => {
    switch (type.toLowerCase()) {
      case 'malware':
        return [
          'Isolate affected systems from the network',
          'Update antivirus definitions and run full system scan',
          'Investigate entry point and patch vulnerabilities',
          'Restore from clean backup if available'
        ];
      case 'brute force':
        return [
          'Lock affected accounts temporarily',
          'Implement account lockout policies',
          'Enforce stronger password requirements',
          'Enable multi-factor authentication'
        ];
      case 'data exfiltration':
        return [
          'Block identified malicious connections',
          'Revoke compromised credentials',
          'Audit data access permissions',
          'Implement data loss prevention controls'
        ];
      default:
        return [
          'Isolate affected systems',
          'Investigate root cause',
          'Apply security patches',
          'Monitor for continued suspicious activity'
        ];
    }
  };

  // Render timeline events
  const renderTimeline = (timeline) => {
    return (
      <div className="space-y-4">
        { timeline.map((event, index) => (
          <div key={ index } className="flex items-start">
            <div className="mr-4 mt-1">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Clock size={ 16 } className="text-indigo-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">{ event.timestamp }</p>
              <p className="text-sm text-gray-600">{ event.description }</p>
            </div>
          </div>
        )) }
      </div>
    );
  };

  // Default timeline if none provided
  const defaultTimeline = [
    { timestamp: '2025-05-17 23:42:18', description: 'Initial detection of suspicious activity' },
    { timestamp: '2025-05-17 23:43:05', description: 'Pattern matching triggered alert' },
    { timestamp: '2025-05-17 23:45:12', description: 'AI model classified threat' },
    { timestamp: '2025-05-17 23:45:30', description: 'Alert generated and notification sent' }
  ];

  // Render affected systems
  const renderSystems = (systems) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        { systems.map((system, index) => (
          <div key={ index } className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center">
              { system.type === 'server' ? (
                <Server size={ 20 } className="mr-2 text-gray-700" />
              ) : system.type === 'endpoint' ? (
                <Terminal size={ 20 } className="mr-2 text-gray-700" />
              ) : (
                <Router size={ 20 } className="mr-2 text-gray-700" />
              ) }
              <span className="font-medium">{ system.name }</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">IP: { system.ip }</p>
            <p className="text-sm text-gray-600">Status: { system.status }</p>
          </div>
        )) }
      </div>
    );
  };

  // Default affected systems if none provided
  const defaultSystems = [
    { name: 'Web Server 01', ip: '192.168.1.100', type: 'server', status: 'Isolated' },
    { name: 'User Workstation 143', ip: '192.168.3.45', type: 'endpoint', status: 'Compromised' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */ }
        <div className={ `px-6 py-4 flex justify-between items-center ${getSeverityColor(threat.severity)} text-white` }>
          <div className="flex items-center">
            <AlertCircle size={ 24 } className="mr-2" />
            <h2 className="text-xl font-bold">{ threat.type } Threat Detected</h2>
          </div>
          <button
            onClick={ onClose }
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X size={ 24 } />
          </button>
        </div>

        {/* Threat summary */ }
        <div className="px-6 py-4 border-b">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">ID:</span>
              <span className="font-mono">{ threat.id || 'THR-20250518-001' }</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Detected:</span>
              <span>{ threat.detectedAt || '2025-05-18 23:42:18' }</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Status:</span>
              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                { threat.status || 'Active' }
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Confidence:</span>
              <span>{ threat.confidence || '92%' }</span>
            </div>
          </div>
          <p className="mt-3 text-gray-700">
            { threat.description || 'Suspicious activity detected that matches patterns of known threat behaviors. AI analysis indicates possible data exfiltration attempt.' }
          </p>
        </div>

        {/* Tabs navigation */ }
        <div className="px-6 pt-4 border-b">
          <div className="flex space-x-4">
            <button
              className={ `pb-4 px-1 font-medium ${activeTab === 'overview' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}` }
              onClick={ () => setActiveTab('overview') }
            >
              Overview
            </button>
            <button
              className={ `pb-4 px-1 font-medium ${activeTab === 'timeline' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}` }
              onClick={ () => setActiveTab('timeline') }
            >
              Timeline
            </button>
            <button
              className={ `pb-4 px-1 font-medium ${activeTab === 'systems' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}` }
              onClick={ () => setActiveTab('systems') }
            >
              Affected Systems
            </button>
            <button
              className={ `pb-4 px-1 font-medium ${activeTab === 'mitigation' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}` }
              onClick={ () => setActiveTab('mitigation') }
            >
              Mitigation
            </button>
          </div>
        </div>

        {/* Tab content */ }
        <div className="p-6 overflow-y-auto flex-grow">
          { activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Threat Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Classification</h4>
                    <p className="text-gray-700">{ threat.classification || 'Advanced Persistent Threat' }</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Source</h4>
                    <p className="text-gray-700">{ threat.source || 'External IP: 185.142.236.43 (Russia)' }</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Target</h4>
                    <p className="text-gray-700">{ threat.target || 'Database server (192.168.1.25)' }</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Method</h4>
                    <p className="text-gray-700">{ threat.method || 'SSH brute force followed by privilege escalation' }</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Shield size={ 16 } className="text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        { threat.aiAnalysis || 'Pattern analysis indicates this is part of a coordinated campaign targeting financial institutions. Behavior matches APT group "Lazarus" with 87% confidence. Recommend immediate isolation of affected systems and credential rotation.' }
                      </p>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Similar Threats</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">THR-20250423-078</span>
                          <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">THR-20250501-113</span>
                          <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">THR-20250510-042</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) }

          { activeTab === 'timeline' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Event Timeline</h3>
              { renderTimeline(threat.timeline && threat.timeline.length > 0 ? threat.timeline : defaultTimeline) }
            </div>
          ) }

          { activeTab === 'systems' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Affected Systems</h3>
              { renderSystems(threat.affectedSystems && threat.affectedSystems.length > 0 ? threat.affectedSystems : defaultSystems) }
            </div>
          ) }

          { activeTab === 'mitigation' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Mitigation Steps</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <p className="text-yellow-700">
                    These steps are AI-recommended based on the threat profile. Please consult with your security team before implementation.
                  </p>
                </div>

                <ol className="space-y-4">
                  { (threat.mitigationSteps || getMitigationSteps(threat.type || 'malware')).map((step, index) => (
                    <li key={ index } className="flex">
                      <span className="mr-4 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                        { index + 1 }
                      </span>
                      <div className="pt-1">
                        <p className="text-gray-700">{ step }</p>
                      </div>
                    </li>
                  )) }
                </ol>

                <div className="mt-6">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                    Implement Recommended Actions
                  </button>
                </div>
              </div>
            </div>
          ) }
        </div>

        {/* Footer */ }
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <User size={ 16 } className="mr-2" />
            <span>Assigned to: { threat.assignedTo || 'Security Team' }</span>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
              Export Details
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Mark as Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}