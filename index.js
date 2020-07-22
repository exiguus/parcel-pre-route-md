/* globals
  process
  require
*/
const express = require("express");
const http  = require("http");
const path = require("path").posix;
const Bundler = require("parcel-bundler");
const { prerender } = require("./package.json");

const app = express();

if (process.env.NODE_ENV !== "production") {
  const entry = path.join(process.cwd(), "/src/index.html");
  let parcel = new Bundler(entry, {
    outDir: "./dist/dev"
  });
  app.use(parcel.middleware());
} else {
  app.use(
    express.static(path.join(process.cwd(), "/src"), {
      maxAge: "14d"
    })
  );

  prerender.routes.foreach((route) => {
    app.get(`/${route}/?`, (req, res) =>
      res.sendFile(path.join(__dirname + `/src/index.html#!/${route}`))
    );
  });

  // Single Page App: fallback to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname + "/src/index.html"))
  );
}

http.createServer(app).listen(3000, () => {
  console.log(`http server started on port 3000`);
});
