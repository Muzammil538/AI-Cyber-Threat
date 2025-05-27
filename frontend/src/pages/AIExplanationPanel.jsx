import React, { useState } from 'react';
import { Brain, Shield, AlertCircle, ChevronRight, Code, Database, Network, Lock } from 'lucide-react';

export default function AIExplanationPanel({ threatData }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample threat for demonstration if none provided
  const threat = threatData;
  if (!threat) return null; 

  // Fallbacks for optional fields
  const indicators = threat.indicators || [];
  const aiDecisionPath = threat.aiDecisionPath || [];
  const similarPastThreats = threat.similarPastThreats || [];
  const technicalDetails = threat.technicalDetails || {};
  
  // Generate a linear gradient based on confidence percentage
  const getConfidenceGradient = (confidence) => {
    const percent = parseInt(confidence);
    if (isNaN(percent)) return 'bg-gray-200';
    
    if (percent >= 90) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (percent >= 70) return 'bg-gradient-to-r from-yellow-500 to-green-400';
    if (percent >= 50) return 'bg-gradient-to-r from-orange-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-orange-400';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="px-6 py-4 cursor-pointer flex justify-between items-center bg-indigo-50 hover:bg-indigo-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <Brain size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">AI Threat Analysis</h3>
            <p className="text-sm text-gray-600">Explanation of AI detection and classification process</p>
          </div>
        </div>
        <ChevronRight 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} 
        />
      </div>
      
      {expanded && (
        <div className="p-6">
          {/* Confidence meter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Detection Confidence</span>
              <span className="text-sm font-bold text-indigo-600">{threat.confidence}</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getConfidenceGradient(threat.confidence)}`} 
                style={{ width: threat.confidence }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500 italic">
              AI model confidence indicates the reliability of this threat classification
            </div>
          </div>
          
          {/* Detection highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <Shield size={16} className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Detection Method</h4>
                  <p className="text-sm text-gray-700">{threat.detectionMethod}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <AlertCircle size={16} className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Key Indicators</h4>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    {indicators.map((indicator, index) => (
                      <li key={index} className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for detailed analysis */}
          <div className="border-b mb-4">
            <div className="flex space-x-6">
              <button
                className={`pb-2 font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('overview')}
              >
                Decision Path
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'similar' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('similar')}
              >
                Similar Threats
              </button>
              <button
                className={`pb-2 font-medium ${activeTab === 'technical' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('technical')}
              >
                Technical Details
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="mb-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  The AI system analyzed this threat through the following sequential process:
                </p>
                
                <div>
                  {aiDecisionPath.map((step, index) => (
                    <div key={index} className="relative pl-8 pb-6">
                      {/* Timeline connector */}
                      {index < aiDecisionPath.length - 1 && (
                        <div className="absolute top-6 bottom-0 left-4 w-0.5 bg-indigo-200"></div>
                      )}
                      
                      {/* Step marker */}
                      <div className="absolute top-0 left-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                        <span className="text-sm font-medium text-indigo-600">{step.step}</span>
                      </div>
                      
                      {/* Step content */}
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{step.description}</p>
                        <div className="flex items-center mt-1">
                          <div className="text-xs text-gray-500 mr-2">Confidence:</div>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getConfidenceGradient(step.confidence)}`} 
                              style={{ width: step.confidence }}
                            ></div>
                          </div>
                          <div className="ml-2 text-xs font-medium text-gray-700">{step.confidence}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <p className="text-sm text-yellow-800">
                    This represents a simplified view of the AI detection process. The actual model analyzes hundreds of features and patterns simultaneously.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'similar' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  This threat shares characteristics with previous threats detected in your network:
                </p>
                
                <div className="space-y-3">
                  {similarPastThreats.map((similar, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="font-mono text-indigo-600 font-medium">{similar.id}</div>
                        <div className="text-sm">
                          <span className="text-gray-500">Similarity: </span>
                          <span className="font-medium text-gray-900">{similar.similarity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-700">
                  Similarity is calculated based on threat characteristics, behaviors, indicators of compromise, and attack patterns.
                </p>
              </div>
            )}
            
            {activeTab === 'technical' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Code size={16} className="text-indigo-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Process Information</h4>
                    </div>
                    <p className="text-sm text-gray-700">{technicalDetails.processName}</p>
                    <p className="text-sm font-mono text-gray-600 mt-1">{technicalDetails.hash}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Network size={16} className="text-indigo-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Network Indicators</h4>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {threat.technicalDetails.ipAddresses.map((ip, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">{ip}</span>
                        ))}
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-500">Ports: </span>
                        {threat.technicalDetails.ports.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <Lock size={16} className="text-indigo-600 mr-2" />
                    <h4 className="font-medium text-gray-900">MITRE ATT&CK Techniques</h4>
                  </div>
                  <div className="space-y-2">
                    {technicalDetails.techniques.map((technique, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-center">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                        {technique}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
              Export Analysis
            </button>
            <div className="flex items-center text-gray-500 text-sm">
              <Database size={16} className="mr-1" />
              <span>AI model: CyberShield Defender v3.7</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}