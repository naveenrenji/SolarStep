import { Router } from "express";
import { userData } from "../data/index.js";
// import validation from "../data/validation.js";

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const users = await userData.getAll();
      res.json({ users });
    } catch (e) {
      res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
    try {
      const { firstName, lastName, password, email, role } = req.body;
      const createdUser = await userData.createUser(
        firstName,
        lastName,
        password,
        email,
        role
      );

      res.json({ user: createdUser });
    } catch (e) {
      res.status(400).json({ error: e?.toString() });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
      const user = await userData.getUserById(req.params.id);
      res.json({ user });
    } catch (e) {
      res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
    res.send(`POST request to http://localhost:3000/users/${req.params.id}`);
  })
  .delete(async (req, res) => {
    res.send(`DELETE request to http://localhost:3000/users/${req.params.id}`);
  });

export default router;
