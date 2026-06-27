import React, { useEffect, useState } from 'react';
import { Skeleton, Avatar, Space, Typography } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { getHotTravelogues } from '../services/home';

interface Travelogue { id: number; title: string; coverImage: string; author: { name: string; avatar: string }; likeCount: number; }

const TravelogueWaterfall: React.FC = () => {
  const [items, setItems] = useState<Travelogue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHotTravelogues().then((res: any) => {
      setItems(res?.data?.list || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-container">
      <h2 className="section-title">精彩游记</h2>
      <p className="section-subtitle">旅行者们用镜头和文字记录的乌东之美</p>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div style={{ columnCount: 3, columnGap: 20 }}>
          {items.map((t) => (
            <div key={t.id} style={{ breakInside: 'avoid', marginBottom: 20, borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
              <div style={{ width: '100%', background: `url(${t.coverImage}) center/cover`, minHeight: Math.random() * 100 + 200 }} />
              <div style={{ padding: 16 }}>
                <Typography.Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>{t.title}</Typography.Title>
                <Space>
                  <Avatar src={t.author.avatar} size="small" />
                  <span style={{ color: '#999', fontSize: 13 }}>{t.author.name}</span>
                  <span style={{ color: '#FF6B6B', fontSize: 13, marginLeft: 8 }}><HeartOutlined /> {t.likeCount}</span>
                </Space>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelogueWaterfall;
