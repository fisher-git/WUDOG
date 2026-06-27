import React from 'react';
import { Carousel, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

interface BannerItem { id: number; title: string; imageUrl: string; linkUrl?: string; }

const FullWidthBanner: React.FC<{ banners: BannerItem[] }> = ({ banners }) => {
  if (!banners.length) return null;
  return (
    <Carousel autoplay autoplaySpeed={5000} effect="fade" style={{ maxWidth: 1920, margin: '0 auto' }}>
      {banners.map((b) => (
        <div key={b.id}>
          <div style={{
            height: 600, background: `url(${b.imageUrl}) center/cover no-repeat`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
            <div style={{ position: 'relative', textAlign: 'center', color: '#fff', zIndex: 1 }}>
              <h1 style={{ fontSize: 48, fontWeight: 700, textShadow: '0 2px 12px rgba(0,0,0,0.3)', marginBottom: 16 }}>{b.title}</h1>
              <p style={{ fontSize: 20, marginBottom: 32, opacity: 0.9 }}>探索苗族文化，发现非遗之美</p>
              <Button type="primary" size="large" icon={<RightOutlined />} style={{ background: '#C8A45C', borderColor: '#C8A45C', borderRadius: 24, height: 48, paddingInline: 32 }}>
                了解更多
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default FullWidthBanner;
