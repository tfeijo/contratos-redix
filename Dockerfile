# Use imagem oficial do Node
FROM node:lts

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# Copia o restante da aplicação
COPY . .

# Porta da aplicação
EXPOSE 3001

# Comando para rodar o app
CMD ["npm", "run", "dev"]
