import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVendors } from '../services/api';
import VendorModal from '../components/VendorModal';

const MapWalkthrough = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const mapRef = useRef(null);


  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchVendors();
      setVendors(data);
    };
    loadData();
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };


  const getPinPosition = (location) => {
    const posMap = {
      'A01': { top: '20%', left: '30%' },
      'B03': { top: '40%', left: '60%' },
      'C02': { top: '60%', left: '20%' },
      'D05': { top: '70%', left: '75%' },
      'B04': { top: '35%', left: '45%' },
    };
    return posMap[location] || { top: '50%', left: '50%' };
  };

  const categoryColor = {
    '飲食': '#c0302a',
    '服飾': '#0d56a5',
    '文創': '#dafeaa',
    '互動': '#8994fc',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-glass"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ChevronLeft size={20} />
          回首頁
        </button>
      </div>

      <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
          {Object.entries(categoryColor).map(([cat, color]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
              <span style={{ fontSize: '0.9rem' }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={mapRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          width: '200vw',
          height: '200vh',
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 30, 30, 0.5) 0%, rgba(10, 10, 10, 0.8) 100%)',
        }}
      >

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          border: '2px dashed rgba(255,255,255,0.1)',
          borderRadius: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ opacity: 0.2, fontSize: '4rem' }}>校園示意地圖 (請在此替換底圖)</h1>
          

          <div style={{ position: 'absolute', top: '10%', left: '10%', width: '200px', height: '150px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>行政大樓</div>
          <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '300px', height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>圖書館</div>
        </div>

        {vendors.map((vendor) => {
          const pos = getPinPosition(vendor.location);
          return (
            <motion.div
              key={vendor.id}
              whileHover={{ scale: 1.1, zIndex: 50 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVendor(vendor);
              }}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: `3px solid ${categoryColor[vendor.category] || 'white'}`,
                background: `url(${vendor.image[0]}) center/cover`,
                backgroundColor: '#333',
                boxShadow: `0 0 0 1px ${categoryColor[vendor.category] || 'white'}44, 0 8px 20px rgba(0,0,0,0.6), 0 0 20px ${categoryColor[vendor.category] || 'white'}55`
              }} />
              <div style={{
                marginTop: '8px',
                padding: '4px 12px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                borderRadius: '12px',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {vendor.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      <VendorModal 
        vendor={selectedVendor} 
        isOpen={!!selectedVendor} 
        onClose={() => setSelectedVendor(null)} 
      />
    </div>
  );
};

export default MapWalkthrough;
