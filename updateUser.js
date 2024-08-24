// template for code to be update user in REPL

const mongoose = require("mongoose");
const User = require("./models/userModel");

async function updateUser(userId, updateData) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (updatedUser) {
      console.log("User updated successfully:", updatedUser);
    } else {
      console.log("User not found");
    }
  } catch (err) {
    console.log("Error updating user:", err);
  }
}

// enter the above into the terminal and then enter the below details to adjust the information

// updateUser('66c74442be42fe564c156ee3', { name: 'Jane Doe', email: 'jane@example.com' });
