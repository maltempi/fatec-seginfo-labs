# Laboratório — Tráfego HTTP, HTTPS e Wireshark
Professor Thiago Maltempi
FATEC Mogi Mirim - Segurança da Informação

## Segurança da Informação — ADS

Neste laboratório vamos observar, na prática, o que acontece com os dados quando uma aplicação web utiliza **HTTP** ou **HTTPS**.

Você utilizará o **Wireshark** para observar o tráfego gerado pelo seu computador enquanto acessa uma aplicação web preparada para esta aula.

> **ATENÇÃO:** esta aplicação é exclusivamente para fins didáticos.
> **Nunca utilize seu usuário, senha ou qualquer outra informação real neste laboratório.**

---

# 1. Informações do laboratório

Para esse lab eu usei a Azure para fazer o deploy, e vocês conseguirão acessar a aplicação de demonstração. 

Utilize:

```text
http://<URL_DO_SERVIDOR>
```

e:

```text
https://<URL_DO_SERVIDOR>
```

> Notem que esse exemplo pode ser rodado manualmente também, basta ter o nodejs instalado e rodar com npm start. Não há dependências para serem instaladas nessa demonstração.

---

# 2. Objetivos

* identificar uma comunicação HTTP;
* identificar uma comunicação HTTPS;
* identificar endereços IP de origem e destino;
* identificar portas TCP;
* observar requisições HTTP;
* observar parâmetros enviados por uma URL;
* observar dados enviados em uma requisição POST;
* diferenciar dados transmitidos em claro de dados protegidos por TLS;
* compreender o papel do HTTPS na proteção dos dados em trânsito.

---

# 3. Conceitos importantes

Uma comunicação web normalmente envolve várias camadas.

De forma simplificada:

```text
Aplicação
    │
    ├── HTTP / HTTPS
    │
    ├── TCP
    │
    ├── IP
    │
    └── Ethernet / Wi-Fi
```

Quando utilizamos HTTPS, o TLS protege os dados da aplicação:

```text
HTTP
  ↓
TCP
  ↓
IP
```

Já no HTTPS:

```text
HTTP
  ↓
TLS
  ↓
TCP
  ↓
IP
```

O objetivo deste laboratório é observar essa diferença diretamente nos pacotes.

---

# 4. A aplicação do laboratório

A aplicação possui uma tela de login e uma API para demonstração.

Você também pode enviar parâmetros diretamente pela URL.

Por exemplo:

```text
http://<URL_DO_SERVIDOR>/?ABC=1234
```

Também pode enviar vários parâmetros:

```text
http://<URL_DO_SERVIDOR>/?ABC=1234&curso=ADS&mensagem=ola
```

Experimente utilizar apenas dados fictícios.

Por exemplo:

```text
http://<URL_DO_SERVIDOR>/?aluno=Joao&turma=ADS&mensagem=teste
```

Observe que os parâmetros fazem parte da própria URL.

---

# 5. Primeiro experimento — HTTP

Abra o Wireshark e selecione a interface de rede que está sendo utilizada.

Inicie a captura.

Agora acesse:

```text
http://<URL_DO_SERVIDOR>/
```

Depois faça uma requisição com parâmetros:

```text
http://<URL_DO_SERVIDOR>/?ABC=1234&curso=ADS&mensagem=teste
```

Pare a captura.

---

## 5.1 Encontrando a comunicação

Utilize o seguinte filtro:

```text
ip.addr == IP_DO_SERVIDOR
```

Agora experimente:

```text
http and ip.addr == IP_DO_SERVIDOR
```

Esse filtro restringe a visualização aos pacotes HTTP relacionados ao servidor.

---

## 5.2 Encontre a requisição GET

Procure uma requisição semelhante a:

```text
GET /?ABC=1234&curso=ADS&mensagem=teste HTTP/1.1
```

Observe:

* método HTTP;
* URL;
* parâmetros;
* endereço IP de destino;
* porta de destino;
* headers HTTP.

---

# 6. Observe o TCP

Agora procure a conexão TCP associada à requisição HTTP.

Utilize:

```text
tcp and ip.addr == IP_DO_SERVIDOR
```

Observe o estabelecimento da conexão.

O TCP normalmente começa com:

```text
SYN
SYN, ACK
ACK
```

Esse processo é chamado de **three-way handshake**.

---


# 7. Segundo experimento — HTTPS

Agora vamos repetir o experimento utilizando HTTPS.

Acesse:

```text
https://<URL_DO_SERVIDOR>/
```

Dependendo da configuração do certificado do laboratório, seu navegador pode apresentar um aviso relacionado ao certificado.

Isso é esperado em um ambiente didático.

**Não utilize dados reais.**

Faça novamente uma requisição com parâmetros:

```text
https://<URL_DO_SERVIDOR>/?ABC=5678&curso=ADS&mensagem=teste
```

---

# 8. Encontre o tráfego TLS

No Wireshark, utilize:

```text
tls and ip.addr == IP_DO_SERVIDOR
```

Agora observe os pacotes.

Você deverá encontrar mensagens relacionadas ao estabelecimento da conexão TLS, como:

```text
Client Hello
Server Hello
Certificate
Application Data
```

---

# 9. Compare HTTP e HTTPS

No experimento HTTP você conseguiu encontrar:

```text
GET /?ABC=1234&curso=ADS&mensagem=teste
```

No HTTPS, procure novamente os dados enviados.

Você deverá observar que o conteúdo da aplicação não aparece diretamente.

Em vez disso, verá algo semelhante a:

```text
TLS Application Data
```

---

# 10. HTTPS não torna a comunicação invisível

Mesmo utilizando HTTPS, um observador da rede pode conseguir observar informações como:

```text
IP de origem
IP de destino
porta
tamanho dos pacotes
tempo
quantidade de pacotes
informações relacionadas ao protocolo TLS
```

O que o TLS protege é principalmente o **conteúdo da comunicação**.

Portanto:

```text
HTTPS ≠ invisibilidade
```

---

# 11. Terceiro experimento — Login

Agora utilize a tela de login da aplicação.

> **Use somente dados fictícios.**

Por exemplo:

```text
Usuário: aluno01
Senha: senha123
```

Faça o login utilizando HTTP.

Depois repita utilizando HTTPS.

---

## HTTP

Acesse:

```text
http://<URL_DO_SERVIDOR>/
```

Faça login com os dados fictícios.

No Wireshark:

```text
http and ip.addr == IP_DO_SERVIDOR
```

Encontre:

```text
POST /api/login
```

Depois utilize:

```text
Follow → TCP Stream
```

Observe o corpo da requisição.

Você deverá encontrar algo semelhante a:

```json
{
  "usuario": "aluno01",
  "senha": "senha123"
}
```

---

## HTTPS

Agora faça o mesmo utilizando:

```text
https://<URL_DO_SERVIDOR>/
```

No Wireshark:

```text
tls and ip.addr == IP_DO_SERVIDOR
```

Tente encontrar:

```text
aluno01
```

e:

```text
senha123
```

---

# 12. Quarto experimento — ICMP

Agora vamos observar um protocolo que não utiliza TCP.

Abra um terminal e execute:

```bash
ping IP_DO_SERVIDOR
```

No Wireshark:

```text
icmp and ip.addr == IP_DO_SERVIDOR
```

Observe os pacotes:

```text
Echo Request
Echo Reply
```

---

# 14. Wireshark Cheat Sheet

## Todo o tráfego do servidor

```text
ip.addr == IP_DO_SERVIDOR
```

---

## HTTP

```text
http and ip.addr == IP_DO_SERVIDOR
```

---

## HTTPS / TLS

```text
tls and ip.addr == IP_DO_SERVIDOR
```

---

## ICMP

```text
icmp and ip.addr == IP_DO_SERVIDOR
```

---

## TCP

```text
tcp and ip.addr == IP_DO_SERVIDOR
```

---

## Requisições HTTP

```text
http.request
```

---

## Requisições GET

```text
http.request.method == "GET"
```

---

## Requisições POST

```text
http.request.method == "POST"
```

---

## Tráfego na porta 443

```text
tcp.port == 443
```

---

## Tráfego na porta 80

```text
tcp.port == 80
```
