const userService = require("../services/user");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// export const checkAccount = async (req, res) => {
//   try {
//     let data = await userService.checkAccount(req.body.phone);
//     bcrypt.compare(req.body.password, data[0].password, function (err, result) {
//       if (err) throw err;
//       if (result) {
//         res.json(data[0]);
//       } else {
//         res.json(null);
//       }
//     });
//   } catch (error) {
//     console.error("Đã xảy ra lỗi:", error);
//     res.status(500).json({ message: "Đã xảy ra lỗi" });
//   }
// };
// export const checkAccount = async (req, res) => {
//   try {
//     let data = await userService.checkAccount(req.body.phone);
//     // Kiểm tra nếu `data` không phải là `undefined` và chứa ít nhất một phần tử
//     if (data && data.length > 0) {
//       bcrypt.compare(
//         req.body.password,
//         data[0].password,
//         function (err, result) {
//           if (err) throw err;
//           if (result) {
//             res.json(data[0]);
//           } else {
//             res.json(null);
//           }
//         }
//       );
//     } else {
//       res.status(404).json({ message: "Tài khoản không tồn tại" });
//     }
//   } catch (error) {
//     console.error("Đã xảy ra lỗi:", error);
//     res.status(500).json({ message: "Đã xảy ra lỗi" });
//   }
// };
export const checkAccount = async (req, res) => {
  try {
    let data = await userService.checkAccount(req.body.phone);
    // Kiểm tra nếu `data` không phải là `undefined` và chứa ít nhất một phần tử
    if (data && data.length > 0) {
      bcrypt.compare(
        req.body.password,
        data[0].password,
        function (err, result) {
          if (err) throw err;
          if (result) {
            res.json(data[0]);
          } else {
            res.json(null);
          }
        }
      );
    } else {
      res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const createAccount = async (req, res) => {
  try {
    const { nameTK, phone, password } = req.body;

    // Check if the account already exists
    let existingAccount = await userService.checkAccount(phone);
    if (existingAccount && existingAccount.length > 0) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new account
    let result = await userService.createAccount(nameTK, phone, hashedPassword);

    res
      .status(201)
      .json({ message: "Tài khoản đã được tạo thành công", account: result });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const getAvatar = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await userService.getAvatarById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.anhdaidien) {
      return res
        .status(404)
        .json({ message: "Avatar not found for this user" });
    }

    res.json({ avatarUrl: user.anhdaidien });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database query failed" });
  }
};
export const getAll = async (req, res) => {
  try {
    let data = await userService.getAll();
    res.json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
export const updateRole = async (req, res) => {
  const userId = parseInt(req.params.id); // Lấy ID từ tham số URL

  try {
    const result = await userService.updateRoleById(userId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error.message);
    res.status(500).json({ error: "Failed to update role" });
  }
};
export const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  // Kiểm tra xem các trường có trống không
  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  // Đảm bảo oldPassword và newPassword luôn là chuỗi
  const oldPasswordStr = String(oldPassword);
  const newPasswordStr = String(newPassword);

  try {
    // Lấy thông tin người dùng từ DB
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // So sánh mật khẩu cũ (mật khẩu cũ phải là chuỗi đã được chuyển đổi)
    const isMatch = await bcrypt.compare(oldPasswordStr, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không chính xác!" });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPasswordStr, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    const success = await userService.updatePassword(userId, hashedPassword);
    if (!success) {
      return res.status(500).json({ message: "Không thể cập nhật mật khẩu!" });
    }

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Error in changePassword:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đổi mật khẩu!" });
  }
};
