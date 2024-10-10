import jwt from 'jsonwebtoken';

export default async function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('No autorizado');
    }
    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.userId = decoded.userId;
        next()
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).send('Token invalido');
    }
}