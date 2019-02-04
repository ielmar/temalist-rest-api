module.exports = function(app, db) {
    app.get('/categories', (req, res) => {
        db.query('select id, title, slug from category where enabled = 1', function(error, result, fields) {
            if(error) {
                console.log(error);
                var apiResult = {};

                apiResult.meta = {
                    table: 'category',
                    total: 0
                }

                apiResult.data = [];

                res.json(apiResult);
            }

            var resultJson = JSON.stringify(result);
            resultJson = JSON.parse(resultJson);
            var apiResult = {};

            apiResult.meta = {
                table: 'category',
                total: result.length
            }

            apiResult.data = resultJson;

            res.json(apiResult);
        });
    });
};