const categoryRoutes = require("./category_routes");
const newsRoutes = require("./news_routes");
const pageRoutes = require("./page_routes");

module.exports = (app, db) => {
  categoryRoutes(app, db);
  newsRoutes(app, db);
  pageRoutes(app, db);
};
