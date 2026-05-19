import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVendors, isLushCooperative } from '../services/api';


const CATEGORIES = ['全部', '飲食', '服飾', '文創', '互動'];


const CATEGORY_COLORS = {
  '全部': '#050505',
  '飲食': '#c0302a',
  '服飾': '#0d56a5',
  '文創': '#dafeaa',
  '互動': '#8994fc',
};


const LIGHT_CATEGORIES = new Set(['文創']);


const PORTRAIT_ONLY_VENDORS = new Set(['theJOOP.']);

const VendorCard = ({ vendor, index, onClick }) => {
  const [coverImg, setCoverImg] = useState(vendor.image[0]);
  const isLush = isLushCooperative(vendor);

  useEffect(() => {

    if (vendor.image.length > 1 && !PORTRAIT_ONLY_VENDORS.has(vendor.name)) {
      let foundLandscape = false;
      vendor.image.forEach(imgSrc => {
        if (foundLandscape) return;
        const img = new Image();
        img.onload = () => {
          if (!foundLandscape && img.width > img.height) {
            foundLandscape = true;
            setCoverImg(imgSrc);
          }
        };
        img.src = imgSrc;
      });
    }
  }, [vendor.image, vendor.name]);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass-panel"
      onClick={() => onClick(vendor)}
      style={{ 
        cursor: 'pointer', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        height: '250px', 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
          background: `url(${coverImg}) center/cover`,
          filter: 'blur(20px)',
          opacity: 0.6,
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `url(${coverImg}) center/contain no-repeat`,
          zIndex: 1
        }} />
        {isLush && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(10,35,20,0.85)',
            border: '1px solid #3dba6e',
            color: '#3dba6e',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <Leaf size={12} />
            LUSH 減塑合作
          </div>
        )}
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{vendor.name}</h3>
          <span style={{ 
            fontSize: '0.8rem', 
            background: `${CATEGORY_COLORS[vendor.category] || 'rgba(255,255,255,0.15)'}33`,
            color: CATEGORY_COLORS[vendor.category] || 'white',
            border: `1px solid ${CATEGORY_COLORS[vendor.category] || 'rgba(255,255,255,0.2)'}88`,
            padding: '4px 12px', 
            borderRadius: '20px',
            whiteSpace: 'nowrap',
            fontWeight: 600,
          }}>
            {vendor.category}
          </span>
        </div>
        <p style={{ 
          fontSize: '0.9rem', 
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5',
          margin: 0
        }}>
          {vendor.story}
        </p>
      </div>
    </motion.div>
  );
};

const VendorSearch = () => {
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchVendors();
      setVendors(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredVendors = vendors.filter(vendor => {
    const matchCategory = activeCategory === '全部' || vendor.category === activeCategory;
    const matchSearch = vendor.name.includes(searchTerm) || vendor.products.includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const currentVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div ref={topRef} style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <button 
        onClick={() => navigate('/')}
        className="btn btn-glass"
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <ChevronLeft size={20} />
        回首頁
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '2rem', marginBottom: '2rem' }}
      >
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="搜尋攤商名稱或商品..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 24px 16px 56px',
              borderRadius: '999px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '1.1rem',
              outline: 'none'
            }}
          />
          <Search style={{ position: 'absolute', left: '20px', top: '16px', color: 'var(--text-secondary)' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(category => {
            const color = CATEGORY_COLORS[category];
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '8px 24px',
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.15)'}`,
                  background: isActive ? color : 'transparent',
                  color: isActive ? (category === '全部' ? 'white' : '#111') : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 0 16px ${color}66` : 'none',
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-primary)' }}>
          載入中...
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {currentVendors.map((vendor, index) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                index={index}
                onClick={(v) => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  navigate(`/vendor/${v.id}`);
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (() => {

            const pages = [];
            const delta = 1;
            const range = [];

            for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
              range.push(i);
            }

            if (currentPage - delta > 2) range.unshift('...');
            if (currentPage + delta < totalPages - 1) range.push('...');

            const allPages = [1, ...range, totalPages];

            const btnStyle = (active) => ({
              minWidth: '40px',
              height: '40px',
              padding: '0 8px',
              borderRadius: '20px',
              border: 'none',
              background: active ? 'var(--color-tertiary)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: active ? 'default' : 'pointer',
              fontWeight: active ? 700 : 400,
              fontSize: '0.9rem',
              flexShrink: 0,
            });

            return (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>

                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToTop(); }}
                  disabled={currentPage === 1}
                  style={{ ...btnStyle(false), opacity: currentPage === 1 ? 0.3 : 1 }}
                >‹</button>

                {allPages.map((p, i) =>
                  p === '...'
                    ? <span key={`ellipsis-${i}`} style={{ color: 'rgba(255,255,255,0.4)', padding: '0 4px' }}>…</span>
                    : <button
                        key={p}
                        onClick={() => { setCurrentPage(p); scrollToTop(); }}
                        style={btnStyle(currentPage === p)}
                      >{p}</button>
                )}


                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }}
                  disabled={currentPage === totalPages}
                  style={{ ...btnStyle(false), opacity: currentPage === totalPages ? 0.3 : 1 }}
                >›</button>
              </div>
            );
          })()}
        </>
      )}

    </div>
  );
};

export default VendorSearch;
