const { db } = require("../config/db");
const { users } = require("../models/signUpSchema");
const { eq } = require("drizzle-orm");
const bcrypt = require('bcrypt');
const validatePassword = require('../utils/validatePassword');

//抓取會員資料
exports.getProfile = async (req, res) => {
  const userId = +req.params.id;
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      gender: users.gender,
      phone: users.phone,
      email: users.email,
      birthday: users.birthday,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!result.length) return res.status(404).json({ error: "會員不存在" });
  res.json(result[0]);
};

//會員資料修改
exports.updateProfile = async (req, res) => {
    const userId = +req.params.id;
    const { name, gender, phone, birthday } = req.body;

    const existing = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

    const updateData = {};
    if(name!== undefined) updateData.name = name ;
    if(gender!== undefined) updateData.gender = gender ;
    if(phone!== undefined) updateData.phone = phone ;
    if(birthday!== undefined && birthday !== '') updateData.birthday = birthday ;    
    try{
        if (existing.length === 0) {
            const result = await db.insert(users).values({
                id: userId,
                ...updateData,
            }).returning();
            return res.json(result[0]);
        } else {
            const result = await db
                .update(users)
                .set(updateData)
                .where(eq(users.id, userId))
                .returning();
        return res.json(result[0]);
        }
  } catch (err) {
    return res.status(500).json({ error: '資料庫錯誤，請稍後再試'})
  }
};

//大頭貼修改
exports.uploadAvatar = async(req, res) => {
    const userId = +req.body.memberId;
    const fileUrl = req.file.location;
    await db.update(users)
        .set({ avatar: fileUrl })
        .where(eq(users.id, userId));
    res.json({ message:'上傳成功', path: fileUrl });
};

//密碼修改與驗證舊密碼
exports.updateUserPassword = async(req, res) => {
    const userId = +req.params.id;
    const { oldPassword, newPassword } = req.body;

    const result = await db.select()
        .from(users)
        .where(eq(users.id, userId));
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
        .where(eq(users.id, userId));
    res.json({ message: '密碼更新成功' });
};