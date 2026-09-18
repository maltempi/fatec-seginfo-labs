const http = require("http");
const fs = require("fs");
const path = require("path");

const configs = {
  3000: "pagina1.html",
  3001: "pagina2.html",
  3002: "analytics.html",
  3003: "parceiro.html"
};

const names = {
  3000: "ecommerce.loja-a.test",
  3001: "crm.loja-a.test",
  3002: "analytics.terceiro.test",
  3003: "ecommerce.parceiro.test"
};

const events = [];

function start(port) {
  const file = path.join(__dirname, configs[port]);

  const server = http.createServer((req, res) => {
    if (port === 3002 && req.method === "POST" && req.url === "/track") {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => {
        try {
          const event = JSON.parse(body);
          if (event.site && event.acao && event.quando) {
            events.push(event);
          }
        } catch {}
        res.writeHead(204);
        res.end();
      });
      return;
    }

    if (port === 3002 && req.method === "GET" && req.url === "/events") {
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
      });
      res.end(JSON.stringify(events));
      return;
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
        return res.end(String(err));
      }

      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end(data);
    });
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Servidor ${port}: http://${names[port]}:${port}`);
  });
}

Object.keys(configs).forEach(port => start(Number(port)));
