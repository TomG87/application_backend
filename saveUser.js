// template for code to be add user in REPL

async function saveUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    await user.save();
    console.log("User saved successfully");
  } catch (err) {
    console.log("Error saving user:", err);
  }
}

saveUser();
