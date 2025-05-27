import {BrowserRouter as Router, Route, Routes} from 'react-router'
import './App.css'
import CyberThreatDashboard from "./pages/CyberThreatDashboard"
import ThreatDetailModal from "./pages/ThreatDetailModal"


function App() {
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CyberThreatDashboard/>}/>
          <Route path="/threat/:id" element={<ThreatDetailModal/>}/>
        </Routes>
      </Router>
    </>
  )
  
}

export default App
