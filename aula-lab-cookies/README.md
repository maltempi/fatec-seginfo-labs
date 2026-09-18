# Laboratório de Cookies, Cookies de Terceiro e Tracking

**Disciplina:** Segurança da Informação  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Professor:** Thiago Maltempi

## Objetivo

Este laboratório separa quatro conceitos que costumam ser confundidos:

1. **Cookie first-party (host-only)**
2. **Cookie de domínio**
3. **Cookie de terceiro**
4. **Tracking**

O Analytics é um terceiro e fica carregado em um **iframe oculto** dentro das aplicações.

As páginas não fazem `fetch()` diretamente para o Analytics. Elas apenas encaminham eventos genéricos para o iframe usando `postMessage()`. O processamento e o envio ao servidor ficam centralizados no `analytics.html`.

Use somente os dados fictícios do laboratório.

---

## 1. Domínios

Adicione ao arquivo `hosts`:

```text
127.0.0.1 ecommerce.loja-a.test
127.0.0.1 crm.loja-a.test
127.0.0.1 analytics.terceiro.test
127.0.0.1 ecommerce.parceiro.test
```

### Windows

```text
C:\Windows\System32\drivers\etc\hosts
```

### Linux/macOS

```text
/etc/hosts
```

---

## 2. Executar

Na pasta do laboratório:

```bash
npm start
```

Abra:

```text
http://ecommerce.loja-a.test:3000/
```

Outros endereços:

```text
http://crm.loja-a.test:3001/
http://ecommerce.parceiro.test:3003/
http://analytics.terceiro.test:3002/
```

---

# 3. Cookie first-party / host-only

No e-commerce, clique em **Criar cookies**.

Um dos cookies é:

```text
produto=NOTEBOOK
```

Ele não possui `Domain`.

Portanto, é um cookie **host-only**, associado a:

```text
ecommerce.loja-a.test
```

No CRM, ele não deve aparecer.

---

# 4. Cookie de domínio

O outro cookie é:

```text
cliente=CLIENTE-123
Domain=loja-a.test
```

Como estes hosts estão dentro de `loja-a.test`:

```text
ecommerce.loja-a.test
crm.loja-a.test
```

o navegador pode enviar esse cookie aos dois.

Abra o CRM em outra aba.

O CRM deverá mostrar:

```text
cliente=CLIENTE-123
```

mas não:

```text
produto=NOTEBOOK
```

Resumo:

```text
produto
└── ecommerce.loja-a.test

cliente
└── Domain=loja-a.test
    ├── ecommerce.loja-a.test
    └── crm.loja-a.test
```

---

# 5. Cookie de terceiro

O Analytics está em:

```text
analytics.terceiro.test
```

Ele cria:

```text
analytics_id=ANALYTICS-12345
```

Esse cookie pertence ao domínio do Analytics.

Ele não é um cookie de `loja-a.test` e não é enviado ao parceiro.

Durante a navegação, o Analytics fica dentro de um iframe oculto.

---

# 6. Tracking

O iframe do Analytics recebe eventos dos três sites.

Exemplo:

```text
ecommerce.loja-a.test
        │
        │ postMessage()
        ▼
analytics.terceiro.test

crm.loja-a.test
        │
        │ postMessage()
        ▼
analytics.terceiro.test

ecommerce.parceiro.test
        │
        │ postMessage()
        ▼
analytics.terceiro.test
```

A aplicação envia informações como:

```text
site
ação
página
título
horário
produto, quando aplicável
```

O Analytics associa o evento ao seu próprio:

```text
analytics_id=ANALYTICS-12345
```

Assim, o servidor consegue construir um histórico associado ao mesmo identificador:

```text
ANALYTICS-12345
    │
    ├── Loja A → viu Produto
    ├── Loja A → abriu Carrinho
    ├── CRM → consultou cliente
    ├── Parceiro → viu Produto X
    └── Parceiro → adicionou Produto X ao carrinho
```

**Esse é o tracking.**

---

# 7. Efeito surpresa

Faça a navegação sem abrir o Analytics:

1. Abra o e-commerce.
2. Clique em **Criar cookies**.
3. Clique em **Produtos**.
4. Clique em **Carrinho**.
5. Abra o CRM em outra aba.
6. No CRM, clique em **Clientes**.
7. Clique em **Consultar cliente**.
8. Clique em **Alterar cadastro**.
9. Abra o parceiro em outra aba.
10. Clique em **Ofertas**.
11. Clique em **Produto X**.
12. Clique em **Adicionar ao carrinho**.

Agora abra:

```text
http://analytics.terceiro.test:3002/
```

O histórico deverá mostrar eventos dos diferentes sites.

A ideia é demonstrar que:

> O usuário navegou pelos sites normalmente, enquanto um terceiro recebeu eventos de tracking através de um componente incorporado às páginas.

---

# 8. Não confunda

### Cookie first-party

```text
produto=NOTEBOOK
```

Cookie host-only de:

```text
ecommerce.loja-a.test
```

### Cookie de domínio

```text
cliente=CLIENTE-123
Domain=loja-a.test
```

Pode alcançar os subdomínios de `loja-a.test`.

### Cookie de terceiro

```text
analytics_id=ANALYTICS-12345
```

Pertence a:

```text
analytics.terceiro.test
```

### Tracking

É o registro/associação das atividades observadas:

```text
identificador
+
site
+
ação
+
horário
+
outros dados do evento
```

**Cookie de terceiro e tracking são conceitos diferentes.**

Um cookie de terceiro pode ser usado em um sistema de tracking, mas tracking também pode ocorrer por outros mecanismos.

---

# 9. DevTools

Abra `F12` → **Application** → **Cookies**.

Compare:

### E-commerce

```text
produto
cliente
```

### CRM

```text
cliente
```

### Parceiro

Não recebe os cookies de `loja-a.test`.

### Analytics

```text
analytics_id
```

---

# 10. Questões

1. Por que `produto` não aparece no CRM?
2. Por que `cliente` aparece no CRM?
3. Por que `cliente` não aparece no parceiro?
4. A quem pertence `analytics_id`?
5. O Analytics precisa ler `produto` para saber que houve um clique em Produtos?
6. Qual a diferença entre cookie de terceiro e tracking?
7. Como um único identificador pode ser associado a eventos de sites diferentes?
8. Quais questões de privacidade aparecem quando um terceiro consegue construir esse histórico?

---

## Estrutura

```text
lab-cookies/
├── pagina1.html
├── pagina2.html
├── analytics.html
├── parceiro.html
├── server.js
├── package.json
└── README.md
```
