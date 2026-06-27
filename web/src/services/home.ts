import api from './api';

export async function getHomepageData() {
  return api.get('/public/homepage');
}

export async function getCulturalStories() {
  return api.get('/public/cultural-stories');
}

export async function getHotTravelogues(page = 1, pageSize = 10) {
  return api.get('/public/travelogues/hot', { params: { page, pageSize } });
}

export async function submitMerchantApplication(data: any) {
  return api.post('/public/merchant-applications', data);
}
