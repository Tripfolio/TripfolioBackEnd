const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 取出 Bearer 後的 token，

    if(!token) {
        return res.status(401).json({ error: '未提供 Token，無法驗證身份'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: '無效的 Token 或過期'});
        } //若無 Token，拒絕請求

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;