const { dbMember } = require('../config/db');
const { members } = require('../models/schema');
const { eq } = require('drizzle-orm');
const validatePassword = require('../utils/validatePassword');

//抓取會員名單
exports.getMember = async (req, res) => {
    const memberId = +req.params.id;
    const result = await dbMember
        .select({
            id: members.id,
            name: members.name,
            gender: members.gender,
            phone: members.phone,
            email: members.email,
            birthday: members.birthday,
            avatar: members.avatar
        })
        .from(members)
        .where(eq(members.id, memberId));

    if(!result.length) return res.status(404).json({ error: '會員不存在' });
    res.json(result[0]);
};

//會員資料修改
exports.updateMember = async (req, res) => {
    const id = +req.params.id;
    const { name, gender, phone, email, birthday } = req.body;
    const result = await dbMember.update(members)
        .set({ name, gender, phone, email, birthday })
        .where(eq(members.id, id))
        .returning();
    res.json(result[0]);
};

//大頭貼修改
exports.uploadAvatar = async(req, res) => {
    const memberId = req.body.memberId;
    const fileUrl = req.file.location;
    await dbMember.update(members)
        .set({ avatar: fileUrl })
        .where(eq(members.id, memberId));
    res.json({ message:'上傳成功', path: fileUrl });
};

//密碼修改與驗證舊密碼
exports.updatePassword = async(req, res) => {
    const id = +req.params.id;
    const { oldPassword, newPassword } = req.body;

    const result = await dbMember.select()
        .from(members)
        .where(eq(members.id, id));
    const user = result[0];

    if(!user){
        return res.status(404).json({ message: '會員不存在' });
    }
    if(user.password !== oldPassword){
        return res.status(400).json({ message: '舊密碼輸入錯誤'});
    }
    const passwordError = validatePassword(newPassword, user.email);
    if(passwordError){
        return res.status(400).json({ error: passwordError });
    }

    await dbMember.update(members)
        .set({ password: newPassword })
        .where(eq(members.id, id));
    res.json({ message: '密碼更新成功' });
};