export default {
  keys: 'wudong-travel-session-secret',
  koa: {
    port: 7001,
    globalPrefix: '/api',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'wudong_travel',
        synchronize: true,
        logging: true,
        entities: ['**/entity/*.ts'],
        timezone: '+08:00',
      },
    },
  },
  jwt: {
    secret: 'wudong-travel-jwt-secret-key-2026',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },
  sms: {
    provider: 'mock',
    templateId: 'SMS_001',
  },
  upload: {
    oss: {
      region: 'oss-cn-guangzhou',
      bucket: 'wudong-travel',
    },
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
};
