module.exports = function (app, db) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.get("/categories", (req, res) => {
    db.query(
      "select id, title, slug from category where enabled = 1",
      function (error, result, fields) {
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
      }
    );
  });
};
