import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Merchant } from '../entity/merchant';
import { JwtUtil, JwtPayload } from '../utils/jwt';
import { ApiResponse } from '@wudong/shared';

export interface MerchantWorkbenchData {
  todayOrders: number;
  pendingShip: number;
  pendingRefund: number;
  revenue: number;
  recentOrders: { id: number; orderNo: string; amount: number; status: string; createdAt: string }[];
}

@Provide()
export class MerchantWorkbenchService {
  @InjectEntityModel(Merchant)
  merchantRepo: Repository<Merchant>;

  async login(username: string, password: string, jwtUtil: JwtUtil): Promise<ApiResponse<any>> {
    const merchant = await this.merchantRepo.findOne({ where: { username } });
    if (!merchant) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    if (merchant.status !== 'active') {
      return { code: 403, message: '账号已被停用', data: null };
    }

    const valid = await bcrypt.compare(password, merchant.passwordHash);
    if (!valid) {
      return { code: 401, message: '用户名或密码错误', data: null };
    }

    const payload: JwtPayload = {
      userId: merchant.id,
      username: merchant.username,
      role: 'merchant',
      roleId: 0,
    };

    const token = jwtUtil.signToken(payload);

    return {
      code: 200, message: '登录成功',
      data: {
        token, expiresIn: 7 * 24 * 3600,
        merchantInfo: {
          id: merchant.id, username: merchant.username, shopName: merchant.shopName,
          module: merchant.module, contactName: merchant.contactName, contactPhone: merchant.contactPhone,
        },
      },
    };
  }

  async getWorkbench(merchantId: number): Promise<ApiResponse<MerchantWorkbenchData>> {
    return {
      code: 200, message: '查询成功',
      data: {
        todayOrders: 12, pendingShip: 3, pendingRefund: 1, revenue: 3580,
        recentOrders: [
          { id: 1, orderNo: 'ORD202606270001', amount: 358.00, status: 'paid', createdAt: '2026-06-27T10:30:00' },
          { id: 2, orderNo: 'ORD202606270002', amount: 128.00, status: 'confirmed', createdAt: '2026-06-27T11:00:00' },
        ],
      },
    };
  }

  async updateStoreInfo(merchantId: number, data: any): Promise<ApiResponse<null>> {
    await this.merchantRepo.update(merchantId, {
      shopName: data.shopName,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      shopDescription: data.shopDescription,
    });
    return { code: 200, message: '店铺信息已更新', data: null };
  }

  async updatePassword(merchantId: number, oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    const merchant = await this.merchantRepo.findOne({ where: { id: merchantId } });
    if (!merchant) return { code: 404, message: '商家不存在', data: null };

    const valid = await bcrypt.compare(oldPassword, merchant.passwordHash);
    if (!valid) return { code: 400, message: '原密码错误', data: null };

    merchant.passwordHash = await bcrypt.hash(newPassword, 12);
    await this.merchantRepo.save(merchant);
    return { code: 200, message: '密码已修改', data: null };
  }
}
