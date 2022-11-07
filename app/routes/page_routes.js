module.exports = function (app, db) {
  app.get("/page", (req, res) => {
    db.collection("pages")
      .find({ state: "active" })
      .toArray((err, result) => {
        if (err) throw err;

        console.log(result);

        res.send(result);
      });
  });

  app.get("/page/:slug", (req, res) => {
    const slug = req.params.slug;

    const details = {
      slug: slug,
      state: "active",
    };

    db.collection("pages").findOne(details, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });
};
