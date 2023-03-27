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
        const { page, search, roles } = req.query;
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
      const user = await userData.getUserById(req.params.id);
      res.json({ user });
    } catch (e) {
      res.status(404).json({ error: e?.toString() });
    }
  })
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { firstName, lastName, oldPassword, newPassword } = req.body;
        const user = await userData.updateUserWithId(
          req.user,
          id,
          firstName,
          lastName,
          oldPassword,
          newPassword
        );
        res.json({ user });
      } catch (e) {
        res.status(404).json({ error: e?.toString() });
      }
    }
  )
  .delete(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        await userData.deleteUserById(req.user, id);
        res.json({ userId: id, deleted: true });
      } catch (e) {
        res.status(404).json({ error: e?.toString() });
      }
    }
  );

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
