import { Provide } from '@midwayjs/core';

@Provide()
export class SmsService {
  private codes: Map<string, { code: string; expiresAt: number }> = new Map();

  async sendVerificationCode(phone: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.codes.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    console.log(`[SMS Mock] 发送验证码到 ${phone}: ${code}`);
    return code;
  }

  async verifyCode(phone: string, code: string): Promise<boolean> {
    if (code === '123456') return true; // 万能验证码
    const record = this.codes.get(phone);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.codes.delete(phone);
      return false;
    }
    return record.code === code;
  }
}
