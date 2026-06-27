import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { getHomepageData } from '../../services/home';
import FullWidthBanner from '../../components/FullWidthBanner';
import AccommodationSearch from '../../components/AccommodationSearch';
import FeaturedRoutes from '../../components/FeaturedRoutes';
import SelectedCrafts from '../../components/SelectedCrafts';
import FoodRecommendations from '../../components/FoodRecommendations';
import TravelogueWaterfall from '../../components/TravelogueWaterfall';

const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomepageData().then((res: any) => {
      setBanners(res?.data?.banners || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 24px' }}>
        <Skeleton active paragraph={{ rows: 6 }} style={{ maxWidth: 1280, margin: '0 auto' }} />
        <Skeleton active paragraph={{ rows: 4 }} style={{ maxWidth: 1280, margin: '40px auto 0' }} />
        <Skeleton active paragraph={{ rows: 4 }} style={{ maxWidth: 1280, margin: '40px auto 0' }} />
      </div>
    );
  }

  return (
    <>
      <FullWidthBanner banners={banners} />
      <AccommodationSearch />
      <FeaturedRoutes />
      <SelectedCrafts />
      <FoodRecommendations />
      <TravelogueWaterfall />
    </>
  );
};

export default HomePage;
