const User = require("../models/user");
const authMiddleware = require("../middlewares/isAuth");
const { google } = require("googleapis");
const axios = require("axios");
const env = require("../config/env");
const user = require("../models/user");

async function handleCallback(req, res, next) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.REDIRECT_URL
    );

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code not found" });
    }

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens || !tokens.access_token) {
      return res.status(500).json({ error: "Failed to retrieve tokens" });
    }

    const { access_token, refresh_token } = tokens;
    // console.log(tokens);

    let userInfo;
    try {
      userInfo = await axios.get(
        "https://people.googleapis.com/v1/people/me?personFields=emailAddresses,photos,names",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch user info from Google" });
    }

    console.log(userInfo);
    const name = userInfo.data.names.find(
      (name) => name.metadata.primary === true
    )?.displayName;
    const profileImage = userInfo.data.photos.find(
      (photo) => photo.metadata.primary === true
    )?.url;
    const email = userInfo.data.emailAddresses.find(
      (email) => email.metadata.primary === true
    )?.value;

    if (!name || !email) {
      return res.status(500).json({ error: "Required user info not found" });
    }

    const response = await handleUserCreation(
      email,
      profileImage,
      name,
      access_token,
      refresh_token
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in handleCallback:", error);
    next(error);
  }
}

async function handleUserCreation(
  email,
  profileImage,
  name,
  access_token,
  refresh_token
) {
  try {
    // Use findOneAndUpdate with upsert to handle race conditions
    const user = await User.findOneAndUpdate(
      { email }, // search criteria
      {
        $set: {
          name,
          profileImage,
          access_token,
          refresh_token,
        },
      },
      {
        new: true, // return the updated document
        upsert: true, // create if doesn't exist
        runValidators: true, // run model validators on update
      }
    );

    return {
      userId: user._id.toString(),
      token: authMiddleware.generateToken(user._id.toString(), user.email),
      user: {
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    };
  } catch (error) {
    if (error.code === 11000) {
      console.error("Duplicate email detected:", email);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        existingUser.access_token = access_token;
        existingUser.refresh_token = refresh_token;
        existingUser.name = name;
        existingUser.profileImage = profileImage;
        await existingUser.save();

        return {
          userId: existingUser._id.toString(),
          token: authMiddleware.generateToken(
            existingUser._id.toString(),
            existingUser.email
          ),
          user: {
            email: existingUser.email,
            name: existingUser.name,
            profileImage: existingUser.profileImage,
          },
        };
      }
    }

    console.error("Error in handleUserCreation:", error);
    throw new Error("Database operation failed");
  }
}

module.exports = {
  handleCallback,
};
