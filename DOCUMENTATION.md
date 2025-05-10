# 📘 Documentação da API de Contratos

### 🔐 Autenticação
Os endpoints presumem autenticação via JWT, aplicada via middleware global (não visível diretamente neste arquivo).

---

## Endpoints

### `GET /contratos/lista`

**Descrição**: Lista todos os contratos disponíveis.

**Respostas**:
- `200 OK`: Retorna um array de contratos.

---

### `GET /upload/:id`

**Descrição**: Verifica o status de upload de um contrato pelo ID.

**Parâmetros**:
- `id` (path): identificador do contrato.

**Respostas**:
- `200 OK`: Status retornado.
- `404 Not Found`: ID não encontrado.

---

### `POST /upload`

**Descrição**: Faz o upload de um arquivo de contrato.

**Payload**:
- Multipart/form-data com um arquivo no campo `file`.

**Exemplo via curl**:
```bash
curl -F "file=@/caminho/do/arquivo.pdf" http://localhost:3000/upload
```

**Respostas**:
- `201 Created`: Arquivo enviado com sucesso.
- `400 Bad Request`: Problema no envio ou arquivo ausente.
