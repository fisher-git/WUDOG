import { Controller, Get } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';

@Controller('/public')
export class PublicCultureController {
  @Get('/cultural-stories')
  async getCulturalStories(): Promise<ApiResponse<any>> {
    return {
      code: 200, message: '查询成功',
      data: [
        { id: 1, title: '苗族银饰锻造技艺', image: '/images/silver.jpg', description: '苗族银饰以其精湛的锻造技艺闻名，每一件银饰都是匠人精神的结晶。', link: '/products/1' },
        { id: 2, title: '蜡染：蓝白之间的艺术', image: '/images/batik.jpg', description: '苗族蜡染以蜂蜡为墨、蓝靛为彩，在布料上绘制出千年的文化密码。', link: '/products/2' },
        { id: 3, title: '苗族长桌宴文化', image: '/images/feast.jpg', description: '长桌宴是苗族最隆重的待客礼仪，体现了苗族人民热情好客的传统。', link: '/restaurants/1' },
      ],
    };
  }
}
