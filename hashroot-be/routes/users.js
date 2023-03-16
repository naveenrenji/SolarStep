import { Router } from "express";
import { USER_ROLES } from "../constants.js";
import { userData } from "../data/index.js";
import authorizeRequest from "../middleware/authorizeRequest.js";

const router = Router();

router
  .route("/")
  .get(
    authorizeRequest(
      Object.values(USER_ROLES) - [USER_ROLES.CUSTOMER, USER_ROLES.WORKER]
    ),
    async (_, res) => {
      try {
        const users = await userData.getAllUsers();
        res.json({ users });
      } catch (e) {
        res.status(404).json({ error: e?.toString() });
      }
    }
  )
  .post(
    authorizeRequest(
      Object.values(USER_ROLES) - [USER_ROLES.CUSTOMER, USER_ROLES.WORKER]
    ),
    async (req, res) => {
      try {
        const { firstName, lastName, password, email, role } = req.body;
        const createdUser = await userData.createUser(
          firstName,
          lastName,
          password,
          email,
          role,
          req.user
        );

        res.json({ user: createdUser });
      } catch (e) {
        res.status(400).json({ error: e?.toString() });
      }
    }
  );

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
      const user = await userData.getUserById(req.params.id);
      res.json({ user });
    } catch (e) {
      res.status(404).json({ error: e?.toString() });
    }
  })
  .patch(async (req, res) => {
    res.send(`PATCH request to http://localhost:3000/users/${req.params.id}`);
  })
  .delete(async (req, res) => {
    res.send(`DELETE request to http://localhost:3000/users/${req.params.id}`);
  });

router.route("/me").get(async (req, res) => {
  res.status(404).json({ error: "Route not defined yet" });
});

router.route("/search").post(authorizeRequest(), async (req, res) => {
  try {
    const { text, roles } = req.body;
    if (!text && !roles?.length) {
      return res.status(404).json({ error: "Text/Role params are required" });
    }
    const users = await userData.searchUsers({ text, roles });
    res.json({ users });
  } catch (e) {
    res.status(404).json({ error: e?.toString() });
  }
});

export default router;
