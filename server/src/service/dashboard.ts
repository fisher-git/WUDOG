import { Provide } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';

export interface DashboardOverview {
  dau: number;
  newUsers: number;
  orderCount: number;
  gmv: number;
  orderTrend: { date: string; clothing: number; food: number; lodging: number; travel: number }[];
  userGrowth: { date: string; count: number }[];
  contentStats: { type: string; count: number }[];
  merchantStats: { total: number; active: number; top: { name: string; revenue: number }[] };
  financeStats: { totalRevenue: number; platformIncome: number; pendingSettlement: number };
}

@Provide()
export class DashboardService {
  async getOverview(range: string): Promise<ApiResponse<DashboardOverview>> {
    // MVP阶段返回模拟数据，后续对接真实数据库查询
    return {
      code: 200,
      message: '查询成功',
      data: {
        dau: 156,
        newUsers: 23,
        orderCount: 89,
        gmv: 12680.50,
        orderTrend: [
          { date: '06-21', clothing: 1200, food: 800, lodging: 3000, travel: 1500 },
          { date: '06-22', clothing: 1500, food: 950, lodging: 2800, travel: 1800 },
          { date: '06-23', clothing: 1100, food: 700, lodging: 3200, travel: 1200 },
          { date: '06-24', clothing: 1800, food: 1000, lodging: 3500, travel: 2000 },
          { date: '06-25', clothing: 1300, food: 850, lodging: 2900, travel: 1600 },
          { date: '06-26', clothing: 1600, food: 900, lodging: 3100, travel: 1700 },
          { date: '06-27', clothing: 1400, food: 750, lodging: 2700, travel: 1900 },
        ],
        userGrowth: [
          { date: '06-21', count: 12 }, { date: '06-22', count: 18 }, { date: '06-23', count: 15 },
          { date: '06-24', count: 25 }, { date: '06-25', count: 20 }, { date: '06-26', count: 22 }, { date: '06-27', count: 23 },
        ],
        contentStats: [
          { type: '游记', count: 45 }, { type: '评论', count: 238 }, { type: '点赞', count: 1205 },
        ],
        merchantStats: {
          total: 32,
          active: 28,
          top: [
            { name: '苗寨银饰坊', revenue: 28500 },
            { name: '苗家客栈', revenue: 22300 },
            { name: '长桌宴餐厅', revenue: 18900 },
          ],
        },
        financeStats: {
          totalRevenue: 156800,
          platformIncome: 15680,
          pendingSettlement: 45200,
        },
      },
    };
  }
}
