import { Router } from "express";
import { userData } from "../data/index.js";
// import validation from "../data/validation.js";

const router = Router();

router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userData.loginUser(email, password);

    res.json({ user });
  } catch (e) {
    res.status(404).json({error: e});
  }
});

export default router;
