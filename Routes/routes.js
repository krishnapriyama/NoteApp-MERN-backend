const router = require("express").Router();
const { register, login,addNotes,getNotes,deleteNote } = require("../Controllers/controllers");
const middleware = require("../Middlewares/authMid");

router.post("/register", register);
router.post("/login", login);
router.post("/addNotes",middleware, addNotes);
router.post("/deleteNote",middleware, deleteNote);
router.get("/getNotes",middleware, getNotes);

module.exports = router;
