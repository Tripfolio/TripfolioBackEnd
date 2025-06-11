const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

const registerUser = async (req, res) => {

	try {
		const { email, password, phone } = req.body;

		const errors = [];

		if (!email || !password || !phone) {
			errors.push('請填寫所有欄位');
		}

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (email && !emailRegex.test(email)) {
			errors.push('Email 格式錯誤');
		}

		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
		if (password && !passwordRegex.test(password)) {
			errors.push('密碼須至少8字 + 英數混合');
		}
		if (password === email) {
			errors.push('密碼不可與信箱相同');
		}

		const phoneRegex = /^09\d{8}$/;
		if (phone && !phoneRegex.test(phone)) {
			errors.push('手機號碼格式錯誤');
		}

		if (email) {
			const existingUser = await UserModel.findByEmail(email);
			if (existingUser) {
				errors.push('Email 已被註冊');
			}
		}

		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await UserModel.createUser({
			email,
			password: hashedPassword,
			phone,
		});

		res.status(201).json({ message: '註冊成功，請重新登入' });
	} catch (err) {
		console.error('❌ 寫入資料庫失敗:', err);
		res.status(500).json({ errors: ['伺服器錯誤，請稍後再試'] });
	}
};

module.exports = {
	registerUser,
};

