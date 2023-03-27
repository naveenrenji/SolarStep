import { Router } from "express";
import { USER_ROLES } from "../constants.js";
import authorizeRequest from "../middleware/authorizeRequest.js";
import { userData } from "../data/index.js";

const router = Router();

router
  .route("/")
  .get(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { page, search, roles } = req.params;
        if (page !== "") {
          if (page <= 0) {
            throw "negative page number or zero page number not allowed";
          }
        }
        const { users, totalPages } = await userData.getPaginatedUsers(
          req.user,
          page,
          search,
          roles
        );
        res.json({ users, totalPages });
      } catch (e) {
        res.status(404).json({ error: e?.toString() });
      }
    }
  )
  .post(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
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
