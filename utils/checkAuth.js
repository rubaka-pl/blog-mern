import jwt from 'jsonwebtoken';
app.get('/auth/me', async (req, res) => {
    const header = req.headers.authorization || '';
    const token = header.replace(/Bearer\s?/, '');

    if (!token) {
        return res.status(200).json(null); // просто нет юзера
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id).select('-passwordHash');
        res.json(user);
    } catch (e) {
        return res.status(200).json(null); // токен битый — просто не авторизован
    }
});
export default checkAuth;