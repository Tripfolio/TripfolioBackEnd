const { db } = require('../config/db');
const { users } = require('../models/loginSchema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcrypt');
const validatePassword = require('../utils/validatePassword');


//密碼修改與驗證舊密碼
exports.updateUserPassword = async(req, res) => {
    const id = +req.params.id;
    const { oldPassword, newPassword } = req.body;

    const result = await db.select()
        .from(users)
        .where(eq(users.id, id));
    const user = result[0];

    if(!user){
        return res.status(404).json({ message: '會員不存在' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
        return res.status(400).json({ message:'舊密碼輸入錯誤' });
    }

    const passwordError = validatePassword(newPassword);
    if(passwordError){
        return res.status(400).json({ error: passwordError });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, id));
    res.json({ message: '密碼更新成功' });
};