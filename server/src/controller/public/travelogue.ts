import { Controller, Get, Query } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';

@Controller('/public')
export class PublicTravelogueController {
  @Get('/travelogues/hot')
  async getHotTravelogues(@Query('page') page = 1, @Query('pageSize') pageSize = 10): Promise<ApiResponse<any>> {
    return {
      code: 200, message: '查询成功',
      data: {
        list: [
          { id: 1, title: '苗寨清晨：云雾中的梯田', coverImage: '/images/travel1.jpg', author: { name: '旅行者小王', avatar: '/images/avatar1.jpg' }, likeCount: 128, createdAt: '2026-06-25' },
          { id: 2, title: '体验苗族银饰制作全过程', coverImage: '/images/travel2.jpg', author: { name: '手工艺爱好者', avatar: '/images/avatar2.jpg' }, likeCount: 96, createdAt: '2026-06-24' },
          { id: 3, title: '三天两夜乌东深度游攻略', coverImage: '/images/travel3.jpg', author: { name: '背包客小李', avatar: '/images/avatar3.jpg' }, likeCount: 215, createdAt: '2026-06-23' },
          { id: 4, title: '在苗寨找到了心灵的宁静', coverImage: '/images/travel4.jpg', author: { name: '城市逃离者', avatar: '/images/avatar4.jpg' }, likeCount: 67, createdAt: '2026-06-22' },
        ],
        total: 4, page: Number(page), pageSize: Number(pageSize),
      },
    };
  }
}
