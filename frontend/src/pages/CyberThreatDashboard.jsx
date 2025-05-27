import React, { useState, useEffect } from 'react';
import { Shield, Bell, Settings, LogOut, Menu, X, Search } from 'lucide-react';
import ThreatMonitoringDashboard from './ThreatMonitoringDashboard';
import ThreatDetailModal from './ThreatDetailModal';

export default function CyberThreatDashboard() {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate getting notifications
  
  // Handle selecting a threat to view details
  const handleThreatSelect = (threat) => {
    setSelectedThreat(threat);
  };
  
  // Handle closing the threat detail modal
  const handleCloseModal = () => {
    setSelectedThreat(null);
  };
  
  
  // Get unread notification count
  // const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-medium text-gray-600">Loading Threat Detection System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        
        {/* Main dashboard content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <ThreatMonitoringDashboard onThreatSelect={handleThreatSelect} />
        </main>
      </div>
      
      {/* Threat detail modal */}
      {selectedThreat && (
        <ThreatDetailModal 
          threat={selectedThreat} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}