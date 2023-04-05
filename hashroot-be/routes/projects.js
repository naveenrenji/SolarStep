import { Router } from "express";
import { projectsData } from "../data/index.js";
import { USER_ROLES } from "../constants.js";
import * as helpers from "../helpers.js";
import authorizeRequest from "../middleware/authorizeRequest.js";

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      let { page, search, statuses } = req.query;
      if (page !== "") {
        if (page <= 0) {
          throw "negative page number or zero page number not allowed";
        }
      }
      const { projects, totalPages } = await projectsData.getPaginatedProjects(
        req.user,
        page,
        search,
        statuses
      );
      res.status(200).json({
        projects,
        totalPages,
      });
    } catch (e) {
      if (e === "negative page number or zero page number not allowed") {
        return res.status(400).json({ error: e.message, e });
      } else return res.status(500).json({ error: e.message, e });
    }
  })
  .post(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      const projectData = req.body;
      try {
        let { userId, projectName, address, salesRepId } = projectData;
        if (req.user.role === USER_ROLES.ADMIN) {
          helpers.checkId(salesRepId, "Sales Rep Id");
        } else {
          salesRepId = req.user._id;
        }
        const project = await projectsData.createProject(
          req.user,
          userId,
          salesRepId,
          projectName,
          address
        );
        return res.status(200).json({ project });
      } catch (e) {
        return res.status(400).json({ error: e.message, e });
      }
    }
  );

router.route("/:id").get(async (req, res) => {
  try {
    const id = req.params.id;
    const project = await projectsData.getProjectById(req.user, id);
    return res.status(200).json({ project });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.route("/:id/files/:fileId/sign").patch(async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const { customerSign, generalContractorSign } = req.body;
    if (!customerSign && !generalContractorSign) {
      throw new Error("customerSign or generalContractorSign is required");
    }
    const project = await projectsData.signDocument(req.user, id, fileId, {
      customerSign,
      generalContractorSign,
    });
    return res.status(200).json({ project });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});
//   .put(async (req, res) => {
//     try {
//       const id = req.params.id;
//       const updatedProject = await projectsData.updateProject(
//         id,
//         req.session._id,
//         req.body
//       );
//       return res.status(200).json({ project: updatedProject });
//     } catch (e) {
//       return res.status(500).json({ error: e });
//     }
//   });

// router.route("/:id/delete").delete(async (req, res) => {
//   try {
//     const id = req.params.id;
//     await projectsData.deleteProject(id, req.session._id);
//     return res.status(200).json({ message: "Project deleted successfully" });
//   } catch (e) {
//     return res.status(500).json({ error: e });
//   }
// });

export default router;
