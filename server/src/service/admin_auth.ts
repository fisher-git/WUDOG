import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../entity/admin_user';
import { JwtUtil, JwtPayload } from '../utils/jwt';
import { SmsService } from './sms';
import { ApiResponse, AuthLoginResponse } from '@wudong/shared';

@Provide()
export class AdminAuthService {
  @InjectEntityModel(AdminUser)
  adminUserRepo: Repository<AdminUser>;

  @Inject()
  jwtUtil: JwtUtil;

  @Inject()
  smsService: SmsService;

  async sendSms(phone: string): Promise<void> {
    await this.smsService.sendVerificationCode(phone);
  }

  async login(username: string, password: string, smsCode: string): Promise<ApiResponse<AuthLoginResponse>> {
    const user = await this.adminUserRepo.findOne({ where: { username } });
    if (!user) {
      return { code: 401, message: '用户名或密码错误', data: null as any };
    }

    if (user.status === 'disabled') {
      return { code: 403, message: '账号已被禁用', data: null as any };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { code: 401, message: '用户名或密码错误', data: null as any };
    }

    // SMS二次验证（开发环境可用万能验证码123456）
    if (user.phone) {
      const isSmsValid = await this.smsService.verifyCode(user.phone, smsCode);
      if (!isSmsValid) {
        return { code: 401, message: '短信验证码错误或已过期', data: null as any };
      }
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await this.adminUserRepo.save(user);

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      role: 'admin',
      roleId: user.roleId || 0,
    };

    const token = this.jwtUtil.signToken(payload);
    const refreshToken = this.jwtUtil.signRefreshToken(payload);

    return {
      code: 200,
      message: '登录成功',
      data: {
        token,
        refreshToken,
        expiresIn: 7 * 24 * 3600,
        userInfo: {
          id: user.id,
          username: user.username,
          name: user.name,
          roleId: user.roleId || 0,
          roleName: '',
        },
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string; expiresIn: number }>> {
    const payload = this.jwtUtil.verifyToken(refreshToken);
    if (!payload) {
      return { code: 401, message: '刷新令牌无效或已过期', data: null as any };
    }

    const newToken = this.jwtUtil.signToken({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      roleId: payload.roleId,
    });

    const newRefreshToken = this.jwtUtil.signRefreshToken({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      roleId: payload.roleId,
    });

    return {
      code: 200,
      message: '刷新成功',
      data: { token: newToken, refreshToken: newRefreshToken, expiresIn: 7 * 24 * 3600 },
    };
  }

  async logout(token: string): Promise<ApiResponse<null>> {
    this.jwtUtil.addToBlacklist(token);
    return { code: 200, message: '已退出登录', data: null };
  }
}
