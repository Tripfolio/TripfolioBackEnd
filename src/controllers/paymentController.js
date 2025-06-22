const { db } = require("../config/db");
const { users } = require("../models/signUpSchema");
const { eq } = require("drizzle-orm");

//付款完成後將使用者改為付費會員
const confirmPayment = async(req, res) => {
    const userId = req.user.id;

    try {
        await db
            .update(users)
            .set({ isPremium: true})
            .where(eq(users.id, userId));
        res.json({ message: "付款成功，您已經升級為付費會員"});
    } catch (err) {
        console.error("付款確認失敗", err);
        res.status(500).json({ message: "付款確認失敗", error: err.message });
    }
};

module.exports = {
    confirmPayment,
};