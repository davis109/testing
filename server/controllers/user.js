const User = require("../models/user");

exports.getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    // Handle guest user
    if (userId === 'guest-user-id') {
      return res.status(200).json({
        name: "Guest User",
        email: "guest@example.com",
        profileImage: "https://ui-avatars.com/api/?name=Guest+User&background=random"
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User info not found", 404);
    }
    const { name, profileImage, email } = user;
    res.status(200).json({
      name,
      profileImage,
      email,
    });
  } catch (error) {
    next(error);
  }
};
