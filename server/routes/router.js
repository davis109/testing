const Router = require("express").Router();

const routers = [require("./test"), require("./auth"), require("./user")];

const resolveAll = (routers) => {
  routers.forEach(({ use, router }) => {
    Router.use(use, router);
  });
};

resolveAll(routers);

module.exports = Router;
