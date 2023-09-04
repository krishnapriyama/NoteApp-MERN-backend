const bcrypt = require("bcrypt");
const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }
  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const data = req.body;
    const user = await userModel.create(data);
    res.json({ user: user._id, created: true });
  } catch (err) {
    console.log(err, "Error from server,register");
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          const fullName = user.fullname;
          const token = jwt.sign({ email }, "SuperSecretKey");
          res.json({ created: true, token, fullName });
        } else {
          res.json({ error: "Invalid password" });
        }
      });
    } else {
      res.json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};




module.exports.addNotes = async (req, res, next) => {
  const { email } = req.user;
  const newNote = {
    title: req.body.title,
    description: req.body.description,
    createdAt: new Date(),
  };

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.notes.push(newNote);
    await user.save();
    console.log("Success");
    res.status(200).json({ message: "Note added successfully", created: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.getNotes = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await userModel.findOne({ email });

    if (user) {
      const notes = user.notes;
      res.json({ notes });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteNote = async (req, res, next) => {
  const { email } = req.user;
  const { id } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const noteIndex = user.notes.findIndex(
      (note) => note._id.toString() === id
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }
    user.notes.splice(noteIndex, 1);
    await user.save();
    return res
      .status(200)
      .json({ message: "Note deleted successfully", deleted: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
