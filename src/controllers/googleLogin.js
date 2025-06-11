const { db } = require("../config/db");
const { googleID } = require("../models/googleID");
const { eq } = require("drizzle-orm");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");


//Google 登入
exports.handleGoogleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) {
            return res.status(400).json({ error: "No ID token provided" });
        }

        // 驗證 ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); // payload 中可以拿到 Google 使用者的資訊
        const { sub, email, name, picture } = payload;

        // 查詢是否有會員
        const result = await db
            .select()
            .from(members)
            .where(eq(members.email, email));
        let user = result[0];
        let userId;

        if (user) {
            userId = user.id;
        } else {
            //自動註冊
            const inserted = await db
                .insert(members)
                .values({
                    email,
                    name,
                    googleId: sub,
                    createdAt: new Date(),
                })
                .returning({ id: members.id });
            userId = inserted[0].id;
        }

        //JWT
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        return res.status(200).json({
            message: "驗證成功",
            accessToken: accessToken,
            user: {
                id: userId,
                email,
                googleId: sub,
                name,
                avatar: picture,
            },
        });
    } catch (err) {
        console.error("Google 登入錯誤:", err);
        return res.status(500).json({ error: "登入失敗" });
    }
};
