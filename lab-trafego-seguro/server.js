const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const protocolo = req.headers["x-forwarded-proto"] || "http";
  const seguro = protocolo === "https";

  // GET /
  if (req.method === "GET" && req.url === "/") {
    enviarPagina(res);
    return;
  }

  // GET /?parametros
  if (req.method === "GET" && req.url.startsWith("/?")) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const parametros = Object.fromEntries(url.searchParams);

    console.log("=== GET RECEBIDO ===");
    console.log("Protocolo:", seguro ? "HTTPS" : "HTTP");
    console.log("Parâmetros:", parametros);
    console.log("====================");

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
      sucesso: true,
      protocolo: seguro ? "HTTPS" : "HTTP",
      parametros: parametros
    }));

    return;
  }

  // POST /api/login
  if (req.method === "POST" && req.url === "/api/login") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const dados = JSON.parse(body);

        console.log("=== LOGIN RECEBIDO ===");
        console.log("Protocolo:", seguro ? "HTTPS" : "HTTP");
        console.log("Usuário:", dados.usuario);
        console.log("Senha:", dados.senha);
        console.log("======================");

        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify({
          sucesso: true,
          mensagem: seguro
            ? "Você está seguro aqui!"
            : "Você pode ter sido hackeado!",
          protocolo: seguro ? "HTTPS" : "HTTP"
        }));

      } catch (erro) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify({
          sucesso: false,
          mensagem: "JSON inválido."
        }));
      }
    });

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify({
    erro: "Rota não encontrada"
  }));
});


function enviarPagina(res) {
  const arquivo = path.join(__dirname, "index.html");

  fs.readFile(arquivo, (err, data) => {
    if (err) {
      res.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8"
      });

      res.end("Erro ao carregar a página.");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end(data);
  });
}


server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
