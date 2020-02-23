const express = require("express");
const app = express();
const http = require("http");
const wes = require("ws");
const helmet = require("helmet");
let names = [];
let id = 0;
const morgan = require("morgan");
const compress = require("compression");
const hash = require("shark-hashlib");
app.use(helmet());
app.use(morgan("common", { immedate: true }));
app.use(compress());
app.set("trust proxy", 1); // trust first proxy

app.set("view engine", "pug");

app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render(__dirname + "/views/index.pug");
});
app.get("/blog", (req, res) => {
  res.redirect("https://bit.ly/BlogShark2");
});

const server = new http.createServer(app);
const usern = require("username-generator");
var user = [];
var users = [];
const wss = new wes.Server({ server });
wss.on("connection", ws => {
  const newuser = usern.generateUsername("-");
  ws.send(JSON.stringify({ action: "welcome", data: newuser }));
  wss.clients.forEach(client => {
    if (client.readyState === wes.OPEN) {
      client.send(
        JSON.stringify({
          action: "join",
          hash: hash(0, newuser),
          user: newuser
        })
      );
    }
  });
  ws.on("message", message => {
    const jsonmessage = JSON.parse(message);
    const hashs = hash(0, jsonmessage.data + jsonmessage.user);
    console.log(Math.round(new Date().getTime()/1000));//80
    if (user.includes(hashs)) {
      if (users.includes(hashs)) {
      } else {
        users.push(hashs);
        if (jsonmessage.action === "push") {
          wss.clients.forEach(client => {
            if (client.readyState === wes.OPEN) {
              if (jsonmessage.data != "" && jsonmessage.user != "") {
                client.send(
                  JSON.stringify({
                    action: "recieve",
                    hash: hashs,
                    user: jsonmessage.user,
                    data: jsonmessage.data
                  })
                );
              }
            }
          });
        }
      }
    } else {
      user.push(hashs);
      if (jsonmessage.action === "push") {
        wss.clients.forEach(client => {
          if (client.readyState === wes.OPEN) {
            if (jsonmessage.data != "" && jsonmessage.user != "") {
              client.send(
                JSON.stringify({
                  action: "recieve",
                  hash: hashs,
                  user: jsonmessage.user,
                  data: jsonmessage.data
                })
              );
            }
          }
        });
      }
    }
  });
});
// listen for requests :)
const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
