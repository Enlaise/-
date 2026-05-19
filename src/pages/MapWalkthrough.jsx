import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Leaf, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapWalkthrough = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
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

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(3, Math.max(0.4, s - e.deltaY * 0.001)));
  };

  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a0a',
        fontFamily: "'Noto Sans TC', sans-serif",
        color: '#fff',
      }}
    >
      {/* ── 紫色漸層光暈（配合視設） ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(120,40,200,0.22) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(80,0,160,0.15) 0%, transparent 60%)',
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
          opacity: 0.5,
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
          { icon: <ZoomOut size={16} />, action: () => setScale((s) => Math.max(0.4, s - 0.3)), label: '縮小' },
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

      {/* ── 左下：圖例 ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: '1.2rem',
          left: '1.2rem',
          zIndex: 20,
          background: 'rgba(10,5,20,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(160,100,255,0.2)',
          borderRadius: '14px',
          padding: '0.9rem 1.1rem',
        }}
      >
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(160,100,255,0.9)', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 700 }}>
          圖例 Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '18px', height: '12px', background: '#fff', border: '1.5px solid #888', borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>一般攤位</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '18px', height: '12px', background: '#3dba6e', border: '1.5px solid #2a9958', borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>LUSH 環保配合攤位</span>
          </div>
        </div>
        <div style={{ marginTop: '0.7rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(160,100,255,0.15)', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Leaf size={12} color="#3dba6e" />
          <span style={{ fontSize: '0.68rem', color: 'rgba(61,186,110,0.85)', lineHeight: 1.4 }}>
            綠色攤位支持 LUSH 零包裝環保方案
          </span>
        </div>
      </motion.div>

      {/* ── 可拖曳地圖 ── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
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

          {/* 圖片容器 */}
          <div
            style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(140,80,255,0.15), 0 24px 70px rgba(0,0,0,0.85), 0 0 50px rgba(100,30,200,0.2)',
            }}
          >
            {/* 暗角 vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />

            {/* 頂部 ribbon */}
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                padding: '10px 14px',
                background: 'linear-gradient(to bottom, rgba(10,0,20,0.7) 0%, transparent 100%)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(160,100,255,0.9)', textTransform: 'uppercase', fontWeight: 700 }}>
                攤位配置圖
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(140,80,255,0.3)' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
                2025 · NCCU Art Fest
              </span>
            </div>

            {/* LUSH badge 右下角 */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                zIndex: 3,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(61,186,110,0.4)',
                borderRadius: '7px',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                pointerEvents: 'none',
              }}
            >
              <Leaf size={11} color="#3dba6e" />
              <span style={{ fontSize: '0.65rem', color: '#3dba6e', fontWeight: 700, letterSpacing: '0.05em' }}>LUSH 環保配合</span>
            </div>

            {/* 地圖本體：使用視設版（紫色美編） */}
            <img
              src="/assets/venue-map-styled.jpg"
              alt="攤位平面圖"
              draggable={false}
              style={{
                display: 'block',
                maxWidth: '82vw',
                maxHeight: '76vh',
                width: 'auto',
                height: 'auto',
                userSelect: 'none',
              }}
            />
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
          拖曳移動 · 滾輪縮放
        </span>
      </div>
    </div>
  );
};

export default MapWalkthrough;
