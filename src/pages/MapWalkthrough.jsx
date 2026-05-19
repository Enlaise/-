import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Leaf, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVendors, LUSH_BOOTHS } from '../services/api';

const generateBoothCoords = () => {
  const coords = {};

  // Row 1 (Upper Row): top ≈ 15.4%, height ≈ 2.2%
  // 1-6
  for (let i = 1; i <= 6; i++) {
    coords[i] = {
      left: 5.6 + (i - 1) * 2.05,
      top: 15.4,
      width: 1.8,
      height: 2.2
    };
  }
  // 7-12
  for (let i = 7; i <= 12; i++) {
    coords[i] = {
      left: 20.0 + (i - 7) * 2.05,
      top: 15.4,
      width: 1.8,
      height: 2.2
    };
  }
  
  // Triangle 1 (Booths 13-20)
  const tri1 = [
    { left: 34.2, top: 20.2 }, // 13
    { left: 36.1, top: 18.0 }, // 14
    { left: 38.0, top: 15.8 }, // 15
    { left: 39.9, top: 13.5 }, // 16
    { left: 41.8, top: 15.8 }, // 17
    { left: 43.7, top: 18.0 }, // 18
    { left: 45.6, top: 20.2 }, // 19
    { left: 47.5, top: 20.2 }  // 20
  ];
  tri1.forEach((pt, idx) => {
    coords[13 + idx] = {
      left: pt.left,
      top: pt.top,
      width: 1.7,
      height: 2.2
    };
  });

  // Triangle 2 (Booths 21-28)
  const tri2 = [
    { left: 53.0, top: 20.2 }, // 21
    { left: 54.9, top: 18.0 }, // 22
    { left: 56.8, top: 15.8 }, // 23
    { left: 58.7, top: 13.5 }, // 24
    { left: 60.6, top: 15.8 }, // 25
    { left: 62.5, top: 18.0 }, // 26
    { left: 64.4, top: 20.2 }, // 27
    { left: 66.3, top: 20.2 }  // 28
  ];
  tri2.forEach((pt, idx) => {
    coords[21 + idx] = {
      left: pt.left,
      top: pt.top,
      width: 1.7,
      height: 2.2
    };
  });

  // Diagonal (Booths 29-32)
  const diag = [
    { left: 69.1, top: 14.5 }, // 29
    { left: 70.8, top: 16.5 }, // 30
    { left: 72.5, top: 18.5 }, // 31
    { left: 74.2, top: 20.5 }  // 32
  ];
  diag.forEach((pt, idx) => {
    coords[29 + idx] = {
      left: pt.left,
      top: pt.top,
      width: 1.5,
      height: 2.0
    };
  });

  // Right Row Upper: 33-36
  for (let i = 33; i <= 36; i++) {
    coords[i] = {
      left: 77.2 + (i - 33) * 2.05,
      top: 15.4,
      width: 1.8,
      height: 2.2
    };
  }
  // Right Row Upper: 37-41
  for (let i = 37; i <= 41; i++) {
    coords[i] = {
      left: 87.0 + (i - 37) * 2.05,
      top: 15.4,
      width: 1.8,
      height: 2.2
    };
  }

  // Row 2 (Lower Row): top ≈ 24.5%, height ≈ 2.2%
  // Left Group (Booths 85-78): right-to-left
  for (let i = 78; i <= 85; i++) {
    coords[i] = {
      left: 5.6 + (85 - i) * 2.05,
      top: 24.5,
      width: 1.8,
      height: 2.2
    };
  }
  // Left-Middle Group (Booths 77-72): right-to-left
  for (let i = 72; i <= 77; i++) {
    coords[i] = {
      left: 20.0 + (77 - i) * 2.05,
      top: 24.5,
      width: 1.8,
      height: 2.2
    };
  }
  
  // LUSH Booth 63
  coords[63] = {
    left: 40.5,
    top: 24.5,
    width: 1.8,
    height: 2.2
  };

  // Middle-Right Group (Booths 62-53): right-to-left
  for (let i = 53; i <= 62; i++) {
    coords[i] = {
      left: 53.0 + (62 - i) * 1.35,
      top: 24.5,
      width: 1.2,
      height: 2.2
    };
  }

  // Right Group (Booths 47-42): right-to-left
  for (let i = 42; i <= 47; i++) {
    coords[i] = {
      left: 77.2 + (47 - i) * 2.05,
      top: 24.5,
      width: 1.8,
      height: 2.2
    };
  }

  return coords;
};

const OFFICIAL_BOOTHS = {
  61: { name: 'HARU 攤位', category: '贊助商公關攤位', isOfficial: true },
  62: { name: '藝術季攤位', category: '主辦攤位', isOfficial: true },
  63: { name: 'LUSH 攤位', category: '贊助商公關攤位', isOfficial: true, isLush: true }
};

const MapWalkthrough = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });

  const [vendors, setVendors] = useState([]);
  const [hoveredBooth, setHoveredBooth] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const boothCoords = generateBoothCoords();

  // Load vendors
  useEffect(() => {
    fetchVendors().then(setVendors);
  }, []);

  // Update initial scale to fit screen dimensions nicely
  useEffect(() => {
    const updateInitialScale = () => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const scaleX = (winW * 0.9) / 1100;
      const scaleY = (winH * 0.75) / 1100; // Fit the cropped map portion height
      const initial = Math.min(1.2, Math.max(0.32, Math.min(scaleX, scaleY)));
      setScale(initial);
    };
    updateInitialScale();
    window.addEventListener('resize', updateInitialScale);
    return () => window.removeEventListener('resize', updateInitialScale);
  }, []);

  // Non-passive wheel listener to resolve console errors
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = 0.08;
      const direction = e.deltaY < 0 ? 1 : -1;
      setScale((s) => Math.min(3, Math.max(0.3, s + direction * zoomFactor)));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handlePointerDown = (e) => {
    // If clicking a button hotspot, or list item, don't drag
    if (e.target.closest('button') || e.target.closest('[data-no-drag]')) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  const reset = () => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const scaleX = (winW * 0.9) / 1100;
    const scaleY = (winH * 0.75) / 1100;
    const initial = Math.min(1.2, Math.max(0.32, Math.min(scaleX, scaleY)));
    setScale(initial);
    setPosition({ x: 0, y: 0 });
  };

  const handleBoothClick = (boothNum) => {
    const target = vendors.find(v => {
      const locStr = String(v.location);
      const parts = locStr.split(/[、,]+/).map(p => p.trim());
      return parts.includes(String(boothNum));
    });
    if (target) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate(`/vendor/${target.id}`);
    }
  };

  // Robust click detection for trackpads and touchscreens to prevent drag cancellation
  const handleHotspotPointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleHotspotPointerUp = (e, num) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    if (dx < 6 && dy < 6) {
      if (OFFICIAL_BOOTHS[Number(num)]) return;
      handleBoothClick(num);
    }
  };

  const renderBoothListColumn = (start, end) => {
    const items = [];
    for (let i = start; i <= end; i++) {
      const isLush = LUSH_BOOTHS.has(i) || (OFFICIAL_BOOTHS[i] && OFFICIAL_BOOTHS[i].isLush);
      let target = OFFICIAL_BOOTHS[i];
      if (!target) {
        target = vendors.find(v => {
          const locStr = String(v.location);
          const parts = locStr.split(/[、,]+/).map(p => p.trim());
          return parts.includes(String(i));
        });
      }

      items.push(
        <div
          key={i}
          onMouseEnter={() => setHoveredBooth(String(i))}
          onMouseLeave={() => setHoveredBooth(null)}
          onClick={() => target && !target.isOfficial && handleBoothClick(i)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            borderRadius: '6px',
            background: hoveredBooth === String(i) ? 'rgba(160,100,255,0.12)' : 'transparent',
            border: hoveredBooth === String(i) ? '1px solid rgba(160,100,255,0.25)' : '1px solid transparent',
            cursor: (target && !target.isOfficial) ? 'pointer' : 'default',
            transition: 'all 0.15s ease',
            fontSize: '0.88rem',
            color: target ? '#fff' : 'rgba(255,255,255,0.28)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              color: isLush ? '#3dba6e' : (OFFICIAL_BOOTHS[i] ? '#a064ff' : 'rgba(160,100,255,0.7)'),
              fontWeight: 700,
              width: '24px',
              display: 'inline-block'
            }}>
              {i}.
            </span>
            <span style={{ fontWeight: target ? 500 : 400 }}>
              {target ? target.name : '（一般攤位）'}
            </span>
            {target && target.isOfficial && (
              <span style={{
                fontSize: '0.68rem',
                color: i === 62 ? 'rgba(255,100,100,0.85)' : 'rgba(160,100,255,0.85)',
                background: i === 62 ? 'rgba(255,100,100,0.08)' : 'rgba(160,100,255,0.08)',
                border: i === 62 ? '1px solid rgba(255,100,100,0.2)' : '1px solid rgba(160,100,255,0.2)',
                padding: '1px 5px',
                borderRadius: '3px',
                marginLeft: '6px'
              }}>
                {target.category}
              </span>
            )}
          </div>
          {isLush && (
            <span style={{
              background: 'rgba(61,186,110,0.12)',
              border: '1px solid rgba(61,186,110,0.25)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.62rem',
              color: '#3dba6e',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              fontWeight: 700
            }}>
              <Leaf size={8} /> LUSH
            </span>
          )}
        </div>
      );
    }
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>{items}</div>;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: 'url(/assets/visual-main.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Noto Sans TC', sans-serif",
        color: '#fff',
      }}
    >
      {/* ── 深紫色漸層毛玻璃底色 overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(12, 6, 25, 0.85) 0%, rgba(5, 5, 12, 0.92) 100%)',
          backdropFilter: 'blur(15px) saturate(130%)',
          WebkitBackdropFilter: 'blur(15px) saturate(130%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* 噪點紋理 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      />

      {/* ── 左上：回首頁 ── */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1.2rem',
          left: '1.2rem',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.5rem 1rem',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '999px',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.05em',
        }}
      >
        <ChevronLeft size={15} />
        回首頁
      </motion.button>

      {/* ── 右上：標題 ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: 'absolute',
          top: '1.1rem',
          right: '1.2rem',
          zIndex: 20,
          textAlign: 'right',
        }}
      >
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(160,100,255,0.85)', textTransform: 'uppercase', marginBottom: '2px' }}>
          NCCU Art Fest · 故・市
        </div>
        <div style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 900, letterSpacing: '0.1em' }}>
          場地平面圖
        </div>
      </motion.div>

      {/* ── 縮放工具列（右側） ── */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '1.2rem',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {[
          { icon: <ZoomIn size={16} />, action: () => setScale((s) => Math.min(3, s + 0.3)), label: '放大' },
          { icon: <ZoomOut size={16} />, action: () => setScale((s) => Math.max(0.3, s - 0.3)), label: '縮小' },
          { icon: <RotateCcw size={16} />, action: reset, label: '重設' },
        ].map(({ icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            title={label}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(120,40,200,0.35)';
              e.currentTarget.style.borderColor = 'rgba(160,100,255,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            {icon}
          </button>
        ))}
      </motion.div>



      {/* ── 可拖曳地圖與清單區域 ── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <motion.div
          animate={{ scale, x: position.x, y: position.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'relative', transformOrigin: 'center center' }}
        >
          {/* 角落裝飾 */}
          {[
            { top: '-14px', left: '-14px', borderWidth: '2px 0 0 2px' },
            { top: '-14px', right: '-14px', borderWidth: '2px 2px 0 0' },
            { bottom: '-14px', left: '-14px', borderWidth: '0 0 2px 2px' },
            { bottom: '-14px', right: '-14px', borderWidth: '0 2px 2px 0' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: '14px', height: '14px', borderStyle: 'solid', borderColor: 'rgba(160,100,255,0.6)', pointerEvents: 'none', zIndex: 3, ...s }} />
          ))}

          {/* 外框光邊 */}
          <div style={{ position: 'absolute', inset: '-8px', border: '1px solid rgba(140,80,255,0.18)', borderRadius: '16px', pointerEvents: 'none', zIndex: 2 }} />

          {/* 完整地圖與 HTML 清單包裝容器 */}
          <div
            style={{
              position: 'relative',
              width: '1100px',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(140,80,255,0.15), 0 24px 70px rgba(0,0,0,0.85), 0 0 50px rgba(100,30,200,0.2)',
            }}
          >
            {/* 1. 地圖渲染區（高度裁切只保留地圖，遮蔽原圖下方低解析度靜態清單） */}
            <div
              style={{
                position: 'relative',
                width: '1100px',
                height: '610px',
                overflow: 'hidden',
              }}
            >
              {/* 原比例地圖定位容器 */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '1100px',
                  height: '1375px',
                }}
              >
                {/* 地圖圖片 */}
                <img
                  src="/assets/venue-map-styled.jpg"
                  alt="攤位平面圖"
                  draggable={false}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    userSelect: 'none',
                  }}
                />              </div>

              {/* 暗角 vignette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />

              {/* 頂部 ribbon */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  padding: '12px 16px',
                  background: 'linear-gradient(to bottom, rgba(10,0,20,0.8) 0%, transparent 100%)',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(160,100,255,0.9)', textTransform: 'uppercase', fontWeight: 700 }}>
                  攤位配置圖
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(140,80,255,0.3)' }} />
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
                  2025 · NCCU Art Fest
                </span>
              </div>
            </div>

            {/* 2. 互動式詳細攤商清單與底部圖例 */}
            <div 
              data-no-drag
              style={{
                background: 'rgba(13, 6, 26, 0.96)',
                borderTop: '1px solid rgba(160,100,255,0.18)',
                padding: '2rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem',
                userSelect: 'text',
                zIndex: 4,
              }}
            >
              {/* 3 欄攤商清單 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem 2rem',
                }}
              >
                {renderBoothListColumn(1, 29)}
                {renderBoothListColumn(30, 58)}
                {renderBoothListColumn(59, 85)}
              </div>

              {/* 橫式響應式圖例條 */}
              <div
                style={{
                  borderTop: '1px solid rgba(160,100,255,0.15)',
                  paddingTop: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.5rem 2.5rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(160,100,255,0.9)', fontWeight: 900 }}>
                  圖例 LEGEND
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>一般商家</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '12px', background: 'rgba(61,186,110,0.25)', border: '1.5px solid #3dba6e', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>LUSH 環保配合商家</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Leaf size={12} color="#3dba6e" />
                  <span style={{ fontSize: '0.72rem', color: 'rgba(61,186,110,0.85)' }}>
                    綠色攤位支持 LUSH 零包裝環保方案
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 底部提示 ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          zIndex: 9,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '8px',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>
          拖曳移動 · 雙擊或滾輪縮放
        </span>
      </div>
    </div>
  );
};

export default MapWalkthrough;
