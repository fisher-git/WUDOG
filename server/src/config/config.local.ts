export default {
  koa: { port: 7001 },
  typeorm: {
    dataSource: {
      default: {
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'wudong_travel_dev',
        synchronize: true,
        logging: true,
      },
    },
  },
};
