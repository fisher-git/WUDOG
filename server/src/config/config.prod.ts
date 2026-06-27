export default {
  koa: { port: 7001 },
  typeorm: {
    dataSource: {
      default: {
        host: 'prod-mysql-host',
        port: 3306,
        username: 'prod_user',
        password: 'prod_password',
        database: 'wudong_travel_prod',
        synchronize: false,
        logging: false,
      },
    },
  },
};
