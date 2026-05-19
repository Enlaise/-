import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Leaf, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapWalkthrough = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showLush, setShowLush] = useState(true);
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
    setScale((s) => Math.min(3, Math.max(0.5, s - e.deltaY * 0.001)));
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
        fontFamily: "'Noto Serif TC', serif",
        color: '#fff',
      }}
    >
      {/* ── 底紋：grain + 暗紅漸層 ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(120,20,20,0.18) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* ── 左上：回首頁 ── */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.55rem 1.1rem',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '999px',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.05em',
        }}
      >
        <ChevronLeft size={16} />
        回首頁
      </motion.button>

      {/* ── 右上：標題區 ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          position: 'absolute',
          top: '1.4rem',
          right: '1.5rem',
          zIndex: 20,
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
            letterSpacing: '0.35em',
            color: 'rgba(255,80,60,0.8)',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}
        >
          第十屆政大藝術季
        </div>
        <div
          style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.6rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#fff',
          }}
        >
          場地平面圖
        </div>
      </motion.div>

      {/* ── 縮放工具列 ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '1.5rem',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {[
          { icon: <ZoomIn size={18} />, action: () => setScale((s) => Math.min(3, s + 0.25)), label: '放大' },
          { icon: <ZoomOut size={18} />, action: () => setScale((s) => Math.max(0.5, s - 0.25)), label: '縮小' },
          { icon: <RotateCcw size={18} />, action: reset, label: '重設' },
        ].map(({ icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            title={label}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200,40,40,0.3)';
              e.currentTarget.style.borderColor = 'rgba(255,80,60,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
            }}
          >
            {icon}
          </button>
        ))}
      </motion.div>

      {/* ── 左下：圖例 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 20,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '1rem 1.3rem',
          minWidth: '200px',
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            color: 'rgba(255,80,60,0.9)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            fontWeight: 700,
          }}
        >
          圖例 Legend
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* 一般攤位 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '20px',
                height: '14px',
                background: '#fff',
                border: '1.5px solid #555',
                borderRadius: '2px',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
              一般攤位
            </span>
          </div>

          {/* LUSH 環保配合 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '20px',
                height: '14px',
                background: '#3dba6e',
                border: '1.5px solid #2a9958',
                borderRadius: '2px',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
              LUSH 環保配合攤位
            </span>
          </div>
        </div>

        {/* LUSH badge */}
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Leaf size={14} color="#3dba6e" />
          <span
            style={{
              fontSize: '0.72rem',
              color: 'rgba(61,186,110,0.9)',
              lineHeight: 1.4,
            }}
          >
            綠色攤位支持 LUSH 零包裝<br />環保永續方案
          </span>
        </div>
      </motion.div>

      {/* ── 提示：可拖曳 ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, calc(-50% - 2px))',
          zIndex: 5,
          pointerEvents: 'none',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textAlign: 'center',
        }}
      />

      {/* ── 可拖曳地圖容器 ── */}
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
          animate={{
            scale,
            x: position.x,
            y: position.y,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'relative', transformOrigin: 'center center' }}
        >
          {/* 外框裝飾 */}
          <div
            style={{
              position: 'absolute',
              inset: '-12px',
              border: '1px solid rgba(255,80,60,0.2)',
              borderRadius: '20px',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              border: '1px dashed rgba(255,255,255,0.06)',
              borderRadius: '26px',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* 角落裝飾符 */}
          {[
            { top: '-18px', left: '-18px', borderWidth: '2px 0 0 2px' },
            { top: '-18px', right: '-18px', borderWidth: '2px 2px 0 0' },
            { bottom: '-18px', left: '-18px', borderWidth: '0 0 2px 2px' },
            { bottom: '-18px', right: '-18px', borderWidth: '0 2px 2px 0' },
          ].map((style, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '16px',
                height: '16px',
                borderStyle: 'solid',
                borderColor: 'rgba(255,80,60,0.5)',
                pointerEvents: 'none',
                zIndex: 3,
                ...style,
              }}
            />
          ))}

          {/* ── 地圖圖片（含 Lush 標示） ── */}
          <div
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(120,20,20,0.25)',
            }}
          >
            {/* 灰底改暗：多層 overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(10,10,10,0.38)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            {/* 四邊漸層暗角 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            <img
              src="/assets/venue-map-lush.jpg"
              alt="攤位平面圖（含LUSH環保配合標示）"
              draggable={false}
              style={{
                display: 'block',
                maxWidth: '80vw',
                maxHeight: '75vh',
                width: 'auto',
                height: 'auto',
                filter: 'brightness(0.82) contrast(1.08) saturate(1.25)',
                userSelect: 'none',
              }}
            />

            {/* 頂部標題 ribbon */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '10px 16px',
                background:
                  'linear-gradient(to bottom, rgba(10,10,10,0.75) 0%, transparent 100%)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(255,80,60,0.9)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                攤位配置圖
              </span>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255,80,60,0.25)',
                }}
              />
              <span
                style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.1em',
                }}
              >
                2025 · NCCU Art Fest
              </span>
            </div>

            {/* LUSH badge（右下角） */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                zIndex: 2,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(61,186,110,0.4)',
                borderRadius: '8px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                pointerEvents: 'none',
              }}
            >
              <Leaf size={12} color="#3dba6e" />
              <span style={{ fontSize: '0.7rem', color: '#3dba6e', fontWeight: 700, letterSpacing: '0.05em' }}>
                LUSH 環保配合
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 底部說明列 ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          zIndex: 9,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '10px',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.2em',
          }}
        >
          拖曳移動 · 滾輪縮放 · 雙指捏合
        </span>
      </motion.div>
    </div>
  );
};

export default MapWalkthrough;
