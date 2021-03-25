import jwt from 'jsonwebtoken';

const verifyAuth = (req, res, next) => {
    const token = req.get('token');
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Error de token: usuario no autenticado',
                err
            });
        };

        // Creamos una nueva propiedad con la info del usuario
        req.user = decoded.data; //data viene al generar el token en route_login.js
        next();
    });    
};

const verifyRol = (req, res, next) => {
    const role = req.user.role;
    if (role !== 'ADMIN') {
        return res.status(401).json({
            message: 'Rol no autorizado!'
        });
    };
    next();
};

module.exports = { verifyAuth, verifyRol };