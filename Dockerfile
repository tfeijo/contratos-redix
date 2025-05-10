# Use imagem oficial do Node
FROM node:lts

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
RUN npm install

# Copia o restante da aplicação
COPY . .

# Gera o Prisma Client com base no schema.prisma e no banco
RUN npx prisma generate

# Porta da aplicação
EXPOSE 3001

# Comando para rodar o app
CMD ["npm", "start"]
