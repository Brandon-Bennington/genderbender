const { signup, login } = require("../controllers/auth-controller");
const { userVerification } = require("../middlewares/auth-middleware"); // updated path
const router = require("express").Router();

router.post("/signup", signup);
router.post('/login', login);
router.post('/', userVerification);

module.exports = router;
