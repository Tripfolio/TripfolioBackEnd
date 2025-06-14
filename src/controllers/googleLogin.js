const UserModel = require('../models/UserModel');
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const handleGoogleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;

        if (!id_token) {
            return res.status(400).json({ error: "No ID token provided" });
        }

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); 
        const { sub, email, name } = payload;

        let user;
        let userId;

        // 查詢是否有會員
        user = await UserModel.findByEmail(email);

        if (user) {
            userId = user.id;
            const updates = {};

            if (sub && user.googleId !== sub) {
                updates.googleId = sub;
            }
            if (Object.keys(updates).length > 0) { 
                updates.updatedAt = new Date();
                user = await UserModel.update(userId, updates);
            }

        } else {
            //自動註冊新會員
            const newUserData = {
                email: email,
                googleId: sub,      
                password: null, // Google 登入，無需密碼
                phone: phone || null,  // 若phone 為 undefined                 
            };
            const insertedUser = await UserModel.createGoogleUser(newUserData);

            userId = insertedUser.id;
            user = insertedUser;
        }

        //JWT
        if (!user || !user.id || !user.email || !user.name) {
            console.error("JWT creation error: Missing user data.", user);
            return res.status(500).json({ 
                error: "無法獲取完整的用戶資料以進行登入" 
            });
        }
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, name: user.name }, 
            process.env.JWT_SECRET, 
            { expiresIn: "8h" }
        );

        return res.status(200).json({
            message: "驗證成功",
            accessToken: accessToken,
            user: {
                id: userId,
                email: user.email,
                googleId: user.googleId,
                name: user.name,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.error("Google 登入錯誤:", err);

        if (err.detail && err.detail.includes('email')) {
                return res.status(409).json({ error: "此電子郵件已被其他帳號使用。" });
            }
        if (err.code === '23505' && err.detail.includes('google_id')) {
            return res.status(409).json({ error: "此 Google 帳號已被使用。" }); 
        }
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Google 驗證失敗或憑證過期，請重新嘗試。' });
        }
        return res.status(500).json({ error: "登入失敗，請稍後再試。" });
    }
};

module.exports = { handleGoogleLogin };