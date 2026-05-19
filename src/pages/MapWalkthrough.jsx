import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Leaf, ZoomIn, ZoomOut, RotateCcw, List, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVendors } from '../services/api';

// 根據 Lush 配合圖標出的綠色攤位編號
const LUSH_STALLS = new Set([1,2,3,6,7,8,9,10,11,12,16,17,84,85,79,78,77,76,75,73,72,71,70,69,68,64,63]);

const MapWalkthrough = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [vendors, setVendors] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  // ── Task 5: Fix passive wheel ──
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setScale(s => Math.min(3, Math.max(0.4, s - e.deltaY * 0.001)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    fetchVendors().then(setVendors);
  }, []);

  const onDown = useCallback((e) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos]);

  const onMove = useCallback((e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  }, [dragging]);

  const onUp = useCallback(() => setDragging(false), []);

  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };

  const getVendorByStall = (num) => vendors.find(v => parseInt(v.id) === num);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Noto Sans TC', sans-serif", color: '#fff' }}>

      {/* ── Task 4: 主視覺背景 + 紫色漸層 ── */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/assets/visual.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25) saturate(0.8)', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 55% 40%, rgba(100,30,180,0.45) 0%, rgba(5,0,15,0.7) 70%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* ── 回首頁 ── */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', zIndex: 30, display: 'flex', alignItems: 'center', gap: 6, padding: '0.45rem 1rem', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
      ><ChevronLeft size={15} />回首頁</motion.button>

      {/* ── 右上標題 ── */}
      <div style={{ position: 'absolute', top: '1.1rem', right: '1.2rem', zIndex: 30, textAlign: 'right' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(160,100,255,0.85)', textTransform: 'uppercase' }}>NCCU Art Fest · 故・市</div>
        <div style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 900, letterSpacing: '0.1em' }}>場地平面圖</div>
      </div>

      {/* ── 右側工具列 ── */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '1.2rem', zIndex: 30, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: <ZoomIn size={16}/>, fn: () => setScale(s => Math.min(3, s + 0.3)) },
          { icon: <ZoomOut size={16}/>, fn: () => setScale(s => Math.max(0.4, s - 0.3)) },
          { icon: <RotateCcw size={16}/>, fn: reset },
        ].map(({ icon, fn }, i) => (
          <button key={i} onClick={fn} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{icon}</button>
        ))}
        {/* 攤商清單按鈕 */}
        <button onClick={() => setShowPanel(p => !p)}
          style={{ width: 38, height: 38, borderRadius: '50%', background: showPanel ? 'rgba(140,80,255,0.5)' : 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: `1px solid ${showPanel ? 'rgba(160,100,255,0.6)' : 'rgba(255,255,255,0.15)'}`, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <List size={16}/>
        </button>
      </div>

      {/* ── 左下圖例 ── */}
      <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', zIndex: 30, background: 'rgba(5,0,18,0.72)', backdropFilter: 'blur(14px)', border: '1px solid rgba(140,80,255,0.2)', borderRadius: 14, padding: '0.85rem 1rem' }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.25em', color: 'rgba(160,100,255,0.9)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>圖例 Legend</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 11, background: '#fff', border: '1.5px solid #aaa', borderRadius: 2 }}/>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>一般攤位</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 11, background: '#3dba6e', border: '1.5px solid #2a9958', borderRadius: 2 }}/>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>LUSH 環保配合</span>
          </div>
        </div>
        <div style={{ marginTop: '0.6rem', paddingTop: '0.55rem', borderTop: '1px solid rgba(140,80,255,0.15)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Leaf size={11} color="#3dba6e"/>
          <span style={{ fontSize: '0.65rem', color: 'rgba(61,186,110,0.85)' }}>綠格支持 LUSH 零包裝環保方案</span>
        </div>
      </div>

      {/* ── Task 1+3: 地圖本體（高畫質 LUSH 版） ── */}
      <div ref={mapRef}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
      >
        <motion.div animate={{ scale, x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} style={{ position: 'relative' }}>
          {/* 角落裝飾 */}
          {[{top:'-12px',left:'-12px',borderWidth:'2px 0 0 2px'},{top:'-12px',right:'-12px',borderWidth:'2px 2px 0 0'},{bottom:'-12px',left:'-12px',borderWidth:'0 0 2px 2px'},{bottom:'-12px',right:'-12px',borderWidth:'0 2px 2px 0'}].map((s,i)=>(
            <div key={i} style={{ position:'absolute', width:14, height:14, borderStyle:'solid', borderColor:'rgba(160,100,255,0.55)', pointerEvents:'none', zIndex:3, ...s }}/>
          ))}
          <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(140,80,255,0.18), 0 24px 70px rgba(0,0,0,0.9), 0 0 60px rgba(100,30,200,0.18)' }}>
            {/* 頂部 ribbon */}
            <div style={{ position:'absolute', top:0, left:0, right:0, padding:'8px 14px', background:'linear-gradient(to bottom,rgba(5,0,18,0.75),transparent)', zIndex:4, display:'flex', alignItems:'center', gap:10, pointerEvents:'none' }}>
              <span style={{ fontSize:'0.6rem', letterSpacing:'0.3em', color:'rgba(160,100,255,0.9)', fontWeight:700 }}>攤位配置圖</span>
              <div style={{ flex:1, height:1, background:'rgba(140,80,255,0.3)' }}/>
              <span style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.3)' }}>2025 · NCCU Art Fest</span>
            </div>
            {/* Task 3: 使用含 LUSH 綠格的地圖；Task 1: 移除模糊 filter */}
            <img
              src="/assets/venue-map-lush.jpg"
              alt="攤位平面圖（含LUSH環保標示）"
              draggable={false}
              style={{
                display: 'block',
                maxWidth: '80vw',
                maxHeight: '74vh',
                width: 'auto',
                height: 'auto',
                imageRendering: '-webkit-optimize-contrast',
                userSelect: 'none',
              }}
            />
            {/* 暗角 */}
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 88% 82% at 50% 50%, transparent 48%, rgba(0,0,0,0.45) 100%)', zIndex:3, pointerEvents:'none' }}/>
            {/* LUSH badge */}
            <div style={{ position:'absolute', bottom:10, right:10, zIndex:4, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', border:'1px solid rgba(61,186,110,0.4)', borderRadius:7, padding:'4px 9px', display:'flex', alignItems:'center', gap:5, pointerEvents:'none' }}>
              <Leaf size={11} color="#3dba6e"/>
              <span style={{ fontSize:'0.62rem', color:'#3dba6e', fontWeight:700 }}>LUSH 環保配合</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Task 2: 攤商清單側拉面板 ── */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 40,
              width: 'clamp(260px, 30vw, 340px)',
              background: 'rgba(5,0,18,0.92)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(140,80,255,0.25)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* 面板標頭 */}
            <div style={{ padding: '1rem 1.1rem 0.7rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(160,100,255,0.85)', textTransform: 'uppercase' }}>攤位一覽</div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>點擊前往攤商</div>
              </div>
              <button onClick={() => setShowPanel(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4 }}>
                <X size={18}/>
              </button>
            </div>

            {/* 攤位清單 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.6rem 0.7rem' }}>
              {vendors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>載入中...</div>
              ) : (
                vendors.map(v => {
                  const stallNum = parseInt(v.id);
                  const isLush = LUSH_STALLS.has(stallNum);
                  return (
                    <motion.div
                      key={v.id}
                      whileHover={{ backgroundColor: 'rgba(140,80,255,0.18)', x: 3 }}
                      onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(`/vendor/${v.id}`); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '0.55rem 0.7rem', borderRadius: 9, cursor: 'pointer',
                        borderLeft: isLush ? '2.5px solid #3dba6e' : '2.5px solid transparent',
                        marginBottom: 3,
                        transition: 'background 0.2s',
                      }}
                    >
                      {/* 攤號 */}
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, color: isLush ? '#3dba6e' : 'rgba(160,100,255,0.7)',
                        minWidth: 24, textAlign: 'right', flexShrink: 0
                      }}>
                        {stallNum || v.id}
                      </span>
                      {/* 名稱 */}
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.88)', flex: 1, lineHeight: 1.3 }}>
                        {v.name}
                      </span>
                      {/* LUSH 葉子 */}
                      {isLush && <Leaf size={12} color="#3dba6e" style={{ flexShrink: 0 }}/>}
                      {/* 類別 */}
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                        {v.category}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* LUSH 說明 */}
            <div style={{ padding: '0.7rem 1rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Leaf size={13} color="#3dba6e"/>
              <span style={{ fontSize: '0.68rem', color: 'rgba(61,186,110,0.8)' }}>左側綠線 = LUSH 零包裝環保配合攤位</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部提示 */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', zIndex: 9, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, pointerEvents: 'none' }}>
        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>拖曳移動 · 滾輪縮放 · 右側清單可點擊前往攤商</span>
      </div>
    </div>
  );
};

export default MapWalkthrough;
