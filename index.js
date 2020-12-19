const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const TorrentSearchApi = require("torrent-search-api");
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE,PUT, OPTIONS"
  );
  next();
});

app.post("/", (req, res, next) => {
  TorrentSearchApi.enableProvider("1337x");
  getData();
  async function getData() {
    const torrents = await TorrentSearchApi.search(
      req.body.name,
      "Movies",
      20
    ).then((resp) => {
      getMagenet();
      async function getMagenet() {
        const magnet = await TorrentSearchApi.getMagnet(resp[0]).then(
          (magres) => {
            res.status(200).json({
              torrent: resp[0],
              magnet: magres,
            });
          }
        );
      }
    });
  }
});

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Working fine",
  });
});

app.listen(port, () => {
  console.log("Listening in port 8000");
});
