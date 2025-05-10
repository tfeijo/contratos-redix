import jwt  from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'jwt';

function autenticarToken(req, res, next) {
  console.log(process.env.JWT_SECRET);
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não enviado.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    console.log(payload);

    req.auth = payload;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
}

export default autenticarToken;
