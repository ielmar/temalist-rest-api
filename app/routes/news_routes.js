var moment = require("moment");
var redis = require("redis");
var slug = require("slug");
var dotenv = require('dotenv')
dotenv.config();

client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

moment.locale("az");

module.exports = function (app, db) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.get("/news/last50news", (req, res) => {
    // query to run
    var sql =
      "select n.id, n.title, n.news_img, n.news_date, n.fb_desc from news n where n.enabled = 1 order by id desc limit 50";

    db.query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
        var apiResult = {};

        apiResult.meta = {
          table: "category",
          total: 0,
        };

        apiResult.data = [];

        res.json(apiResult);
      }

      var resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      var apiResult = {};

      apiResult.meta = {
        table: "category",
        total: result.length,
      };

      apiResult.data = resultJson;

      res.json(apiResult);
    });
  });

  app.get("/news/last100news", (req, res) => {
    // query to run
    var sql =
      "select n.id, n.title, n.news_img, n.news_date, n.fb_desc from news n where n.enabled = 1 order by id desc limit 100";

    db.query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
        var apiResult = {};

        apiResult.meta = {
          table: "category",
          total: 0,
        };

        apiResult.data = [];

        res.json(apiResult);
      }

      var resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      var apiResult = {};

      apiResult.meta = {
        table: "category",
        total: result.length,
      };

      apiResult.data = resultJson;

      res.json(apiResult);
    });
  });

  app.get("/news/getTop10", (req, res) => {
    // query to run
    var sql =
      "select n.id, n.title, n.news_img, n.news_date, n.fb_desc from news n where n.enabled = 1 order by n.viewed desc limit 100";

    db.query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
        var apiResult = {};

        apiResult.meta = {
          table: "category",
          total: 0,
        };

        apiResult.data = [];

        res.json(apiResult);
      }

      var resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      var apiResult = {};

      apiResult.meta = {
        table: "category",
        total: result.length,
      };

      apiResult.data = resultJson;

      res.json(apiResult);
    });
  });

  app.get("/news/last50newsByCategoryId/:id", (req, res) => {
    const id = req.params.id;

    // query to run
    var sql =
      "select n.id, n.title, n.news_img, n.news_date, n.fb_desc, c.title c_title, c.id c_id, c.slug c_slug" +
      " from news n, news_to_category ntc, category c" +
      " where n.enabled = 1 and ntc.category_id = c.id and ntc.news_id = n.id and c.id = " +
      id +
      " order by n.id desc limit 50";

    db.query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
        var apiResult = {};

        apiResult.meta = {
          table: "category",
          total: 0,
        };

        apiResult.data = [];

        res.json(apiResult);
      }

      var resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      var apiResult = {};

      apiResult.meta = {
        table: "category",
        total: result.length,
      };

      apiResult.data = resultJson;

      res.json(apiResult);
    });
  });

  app.get("/news/:id", (req, res) => {
    const id = req.params.id;

    // get data from redis
    client.get("tmlst:" + id, function (err, result) {
      // check if the data is on redis
      if (result !== null) {
        var newsData = JSON.parse(result);

        var apiResult = {};

        apiResult.meta = {
          table: "category",
          total: newsData.length,
        };

        apiResult.data = newsData;

        res.json(apiResult);
      } else {
        // data is not in redis. get it from mysql, save it to redis and send as a result

        // query to run
        var sql =
          "select n.id, n.title, n.news_img, n.content, n.news_date, n.fb_desc, n.viewed, c.title c_title, c.id c_id, c.slug c_slug" +
          " from news n, news_to_category ntc, category c" +
          " where n.enabled = 1 and ntc.category_id = c.id and ntc.news_id = n.id and n.id = " +
          id +
          " order by n.id desc";

        db.query(sql, function (error, result, fields) {
          if (error) {
            console.log(error);
            var apiResult = {};

            apiResult.meta = {
              table: "news",
              total: 0,
            };

            apiResult.data = [];

            res.json(apiResult);
          }

          var resultJson = JSON.stringify(result);
          resultJson = JSON.parse(resultJson);

          // loop through rows and add them as a new object
          var categoryObject = [];
          resultJson.map((item) => {
            var cat = {
              id: item.c_id,
              title: item.c_title,
              slug: "kategoriya-" + item.c_slug,
            };

            // delete it from the newsData result
            delete item.c_id;
            delete item.c_title;
            delete item.c_slug;

            // push the object into categoryObject
            categoryObject.push(cat);
          });

          // get the first row. if it has more than 1 category, it returns more than 1 row
          var newsObject = resultJson[0];

          // add category object to the newsObject
          newsObject.category = categoryObject;

          // add slug to the newsObject
          newsObject.slug =
            slug(newsObject.title).toLowerCase() + "-" + newsObject.id;

          // add newsObject to redis
          client.set("tmlst:" + newsObject.id, JSON.stringify(newsObject));

          var apiResult = {};

          apiResult.meta = {
            table: "news",
            total: newsObject.length,
          };

          apiResult.data = newsObject;

          res.json(apiResult);
        });
      }
    });
  });
};
