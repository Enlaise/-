import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, ExternalLink, Package, Leaf } from 'lucide-react';
import { fetchVendors, isLushCooperative } from '../services/api';

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchVendors();
      const found = data.find(v => v.id === id);
      setVendor(found);
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadData();
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>載入中...</div>;
  if (!vendor) return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>找不到該商家</div>;

  const isLush = isLushCooperative(vendor);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', paddingBottom: '50px' }}>
      {/* 頂部導覽列 */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 10, 
        padding: '1rem', 
        background: 'rgba(10,10,10,0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-glass"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ChevronLeft size={20} />
          上一頁
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 圖片輪播區 */}
        <div style={{
          width: '100%',
          height: '60vh',
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          backgroundColor: '#000',
          scrollbarWidth: 'none'
        }}>
          {vendor.image.map((img, idx) => (
            <div key={idx} style={{ minWidth: '100%', height: '100%', position: 'relative', scrollSnapAlign: 'start' }}>
              <div style={{
                position: 'absolute',
                inset: '-10%',
                background: `url(${img}) center/cover`,
                filter: 'blur(30px)',
                opacity: 0.4
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `url(${img}) center/contain no-repeat`,
                zIndex: 1
              }} />
            </div>
          ))}
        </div>

        {/* 內容區 */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '4px 16px', 
              borderRadius: '20px', 
              fontSize: '0.9rem',
              background: 'var(--color-primary)',
              fontWeight: 600
            }}>
              {vendor.category}
            </span>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{vendor.name}</h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-accent)', marginBottom: '1rem', borderLeft: '4px solid var(--color-accent)', paddingLeft: '12px' }}>
              商家故事
            </h3>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', color: 'rgba(255,255,255,0.9)', textAlign: 'justify' }}>
              {vendor.story}
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '1.5rem',
            background: 'rgba(255,255,255,0.05)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {isLush && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                background: 'rgba(61,186,110,0.07)',
                border: '1px solid rgba(61,186,110,0.3)',
                padding: '1.2rem',
                borderRadius: '16px',
                marginBottom: '0.5rem'
              }}>
                <Leaf size={24} color="#3dba6e" style={{ marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#3dba6e', fontWeight: 700 }}>
                    LUSH 綠色減塑合作商家
                  </h4>
                  <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.85)' }}>
                    本攤商配合 LUSH 零包裝環保方案！自備環保容器/袋子消費，即可享有店家環保小回饋。
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <Package size={24} color="var(--color-tertiary)" style={{ marginTop: '4px' }} />
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>商品內容</h4>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>{vendor.products}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <MapPin size={24} color="var(--color-primary)" style={{ marginTop: '4px' }} />
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>攤位位置</h4>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>{vendor.location}</p>
              </div>
            </div>

            {vendor.socialMedia && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <ExternalLink size={24} color="var(--color-secondary)" style={{ marginTop: '4px' }} />
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>社群連結</h4>
                  <a href={vendor.socialMedia} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
                    前往粉專逛逛
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;


