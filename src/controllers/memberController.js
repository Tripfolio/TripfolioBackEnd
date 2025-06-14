const { db } = require('../config/db');
const { members } = require('../models/memberSchema');
const { eq } = require('drizzle-orm');

//抓取會員資料
exports.getMember = async (req, res) => {
    const memberId = +req.params.id;
    const result = await db
        .select({
            id: members.id,
            name: members.name,
            gender: members.gender,
            phone: members.phone,
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
    const { name, gender, phone, birthday } = req.body;

    const existing = await db
        .select()
        .from(members)
        .where(eq(members.id, id));

    const updateData = {};
    if(name!== undefined) updateData.name = name ;
    if(gender!== undefined) updateData.gender = gender ;
    if(phone!== undefined) updateData.phone = phone ;
    if(birthday!== undefined && birthday !== '') updateData.birthday = birthday ;    
    try{
        if (existing.length === 0) {
            const result = await db.insert(members).values({
                id,
                ...updateData,
            }).returning();
            return res.json(result[0]);
        } else {
            const result = await db.update(members)
                .set(updateData)
                .where(eq(members.id, id))
                .returning();
        return res.json(result[0]);
        }
  } catch (err) {
    console.error('會員資料更新失敗', err);
    return res.status(500).json({ error: '資料庫錯誤，請稍後再試'})
  }
};

//大頭貼修改
exports.uploadAvatar = async(req, res) => {
    const memberId = req.body.memberId;
    const fileUrl = req.file.location;
    await db.update(members)
        .set({ avatar: fileUrl })
        .where(eq(members.id, memberId));
    res.json({ message:'上傳成功', path: fileUrl });
};