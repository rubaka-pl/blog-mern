import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.replace(/Bearer\s?/, '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;
        next();
    } catch (e) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default checkAuth;