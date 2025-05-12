# contratos-redix

Backend escalável para gerenciamento de contratos, com suporte a upload de arquivos, filas assíncronas e autenticação JWT. 

## ✨ Tecnologias Principais

- **Node.js**
- **Express**
- **Prisma ORM**
- **Redis + BullMQ** (filas assíncronas)
- **JWT** (autenticação)
- **Multer** (upload de arquivos)
- **ESLint + Prettier** (padronização de código)

## 📦 Instalação

```bash
git clone https://github.com/tfeijo/contratos-redix.git
cd contratos-redix
npm install
```

## 🚀 Uso em Desenvolvimento

```bash
npm run dev
```

## 🏗️ Deploy

```bash
npm start
```

Esse comando aplica as migrations do Prisma e inicia o servidor Express.

## 🧪 Scripts Disponíveis

| Script           | Descrição                           |
| ---------------- | ----------------------------------- |
| `dev`            | Inicia com `nodemon`                |
| `start`          | Aplica migrations e roda o servidor |
| `lint`           | Executa ESLint                      |
| `lint:fix`       | Corrige automaticamente com ESLint  |
| `prettier`       | Formata o código                    |
| `prettier:check` | Verifica formatação                 |

## 🧰 Estrutura Esperada

```
src/
├── server.js          # ponto de entrada
├── routes/            # rotas express
├── controllers/       # lógica de controle
├── services/          # regras de negócio
├── jobs/              # workers BullMQ
├── middlewares/       # autenticação, erros etc.
└── prisma/            # schema, migrations
```

## 🔐 Autenticação

Autenticação via token JWT. Para utilizar as rotas protegidas, envie o token no cabeçalho `Authorization`.

## 🧬 Banco de Dados

Utiliza Prisma ORM com suporte a PostgreSQL ou outro banco relacional. Configure as credenciais no arquivo `.env`.

## 🐘 Redis

Necessário para a fila de jobs via BullMQ. Configure a URL do Redis em `.env`.

## 🐳 Docker

O projeto inclui `Dockerfile` e `docker-compose.yml` para facilitar a orquestração em ambientes padronizados.

## 📄 Licença

[MIT](LICENSE)

---

Desenvolvido com dedicação por [Thiago Feijó](https://www.linkedin.com/in/tfeijo)
