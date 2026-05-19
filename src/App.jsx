import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import VendorSearch from './pages/VendorSearch';
import MapWalkthrough from './pages/MapWalkthrough';
import VendorDetail from './pages/VendorDetail';

function AppInner() {
  const location = useLocation();
  const isMap = location.pathname === '/map';

  return (
    <div className="app-container">
      {!isMap && (
        <div className="fluid-background">
          <div className="ripple ripple-1"></div>
          <div className="ripple ripple-2"></div>
          <div className="ripple ripple-3"></div>
        </div>
      )}
      <div className={isMap ? '' : 'content-overlay'}>
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

function App() {
  return <AppInner />;
}

export default App;
