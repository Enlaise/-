import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Map } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>


      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>

        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/visual.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.55)',
          zIndex: 0,
        }} />


        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
          style={{
            position: 'absolute',
            right: '5vw',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'clamp(160px, 22vw, 340px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
            zIndex: 2,
          }}
        >
          <img
            src="/assets/poster.jpg"
            alt="第十屆政大藝術季海報"
            style={{ width: '100%', display: 'block' }}
          />
        </motion.div>


        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: 'clamp(2rem, 8vw, 8rem)',
          maxWidth: '700px',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >

            <p style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}>
              第十屆政大藝術季 ｜ 4.20 – 5.15
            </p>


            <h1 style={{
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              故・市
            </h1>


            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.75)',
              marginBottom: '3rem',
              maxWidth: '480px',
            }}>
              國立政治大學藝術季附屬市集。<br />
              在這裡，每一個攤位都是一個故事，<br />
              等待著與你的共鳴。
            </p>


            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/search')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '999px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <Search size={20} />
                攤商搜尋
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '999px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Map size={20} />
                隨意逛逛
              </motion.button>
            </div>
          </motion.div>
        </div>


        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, transparent, rgba(18,18,18,0.95))',
          zIndex: 1,
        }} />
      </section>

    </div>
  );
};

export default Home;
