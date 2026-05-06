import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ExternalLink, Package } from 'lucide-react';

const VendorModal = ({ vendor, isOpen, onClose }) => {
  if (!isOpen || !vendor) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)'
          }}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-panel"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: 'rgba(30, 30, 30, 0.7)',
            padding: '0'
          }}
        >
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          <div style={{
            width: '100%',
            height: '400px',
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none' // For IE and Edge
          }}>
            {vendor.image.map((img, idx) => (
              <div 
                key={idx}
                style={{
                  minWidth: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  scrollSnapAlign: 'start'
                }} 
              >
                {/* 模糊背景層：填補直式圖片的空白 */}
                <div style={{
                  position: 'absolute',
                  top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
                  background: `url(${img}) center/cover`,
                  filter: 'blur(20px)',
                  opacity: 0.5,
                  zIndex: 0
                }} />
                {/* 主圖片層 */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: `url(${img}) center/contain no-repeat`,
                  zIndex: 1
                }} />
              </div>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.8rem',
                background: 'var(--color-primary)',
                color: 'white'
              }}>
                {vendor.category}
              </span>
              <h2 style={{ margin: 0, fontSize: '2rem' }}>{vendor.name}</h2>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-accent)', marginBottom: '0.8rem' }}>攤商故事</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                {vendor.story}
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '1rem',
              background: 'rgba(0,0,0,0.2)',
              padding: '1.5rem',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Package size={20} color="var(--color-tertiary)" style={{ marginTop: '4px' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>商品內容</h4>
                  <p style={{ margin: 0 }}>{vendor.products}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} color="var(--color-primary)" style={{ marginTop: '4px' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>攤位位置</h4>
                  <p style={{ margin: 0 }}>{vendor.location}</p>
                </div>
              </div>

              {vendor.socialMedia && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <ExternalLink size={20} color="var(--color-secondary)" style={{ marginTop: '4px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>社群連結</h4>
                    <a href={vendor.socialMedia} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                      前往粉專逛逛
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VendorModal;
