const { db } = require("../config/db");
const { members } = require("../models/schema");
const { eq } = require("drizzle-orm");
const validatePassword = require("../utils/validatePassword");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");

//抓取會員名單
exports.getMember = async (req, res) => {
    const memberId = +req.params.id;
    const result = await db
        .select({
            id: members.id,
            name: members.name,
            gender: members.gender,
            phone: members.phone,
            email: members.email,
            birthday: members.birthday,
            avatar: members.avatar,
        })
        .from(members)
        .where(eq(members.id, memberId));

    if (!result.length) return res.status(404).json({ error: "會員不存在" });
    res.json(result[0]);
};

//會員資料修改
exports.updateMember = async (req, res) => {
    const id = +req.params.id;
    const { name, gender, phone, email, birthday } = req.body;
    const result = await db
        .update(members)
        .set({ name, gender, phone, email, birthday })
        .where(eq(members.id, id))
        .returning();
    res.json(result[0]);
};

//大頭貼修改
exports.uploadAvatar = async (req, res) => {
    const memberId = req.body.memberId;
    const fileUrl = req.file.location;
    await db
        .update(members)
        .set({ avatar: fileUrl })
        .where(eq(members.id, memberId));
    res.json({ message: "上傳成功", path: fileUrl });
};

//密碼修改與驗證舊密碼
exports.updatePassword = async (req, res) => {
    const id = +req.params.id;
    const { oldPassword, newPassword } = req.body;

    const result = await db.select().from(members).where(eq(members.id, id));
    const user = result[0];

    if (!user) return res.status(404).json({ message: "會員不存在" });
    if (user.password !== oldPassword)
        return res.status(400).json({ message: "舊密碼輸入錯誤" });

    const passwordError = validatePassword(newPassword, user.email);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    await db
        .update(members)
        .set({ password: newPassword })
        .where(eq(members.id, id));
    res.json({ message: "密碼更新成功" });
};

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
            expiresIn: "2d",
        });

        return res.status(200).json({
            message: "驗證成功",
            token,
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
