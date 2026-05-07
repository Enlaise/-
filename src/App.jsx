import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VendorSearch from './pages/VendorSearch';
import MapWalkthrough from './pages/MapWalkthrough';
import VendorDetail from './pages/VendorDetail';

function App() {
  return (
    <div className="app-container">
      <div className="fluid-background">
        <div className="ripple ripple-1"></div>
        <div className="ripple ripple-2"></div>
        <div className="ripple ripple-3"></div>
      </div>
      <div className="content-overlay">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<VendorSearch />} />
          <Route path="/map" element={<MapWalkthrough />} />
          <Route path="/vendor/:id" element={<VendorDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
