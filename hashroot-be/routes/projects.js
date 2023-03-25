import { Router } from "express";
import { USER_ROLES } from "../constants.js";
import authorizeRequest from "../middleware/authorizeRequest.js";
const helpers = require("../helpers");
const express = require("express");
const router = express.Router();
const data = require("../data");
const projectsData = data.projects;

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    try {
      projectItems = [];
      let page = req.query.page;
      if (page !== "") {
        if (page <= 0) {
          throw "negative page number or zero page number not allowed";
        }
      }
      const projectList = await projectsData.getAllProjects(page);
      projectList.forEach((projectItem) => {
        projectItems.push({
          projectId: projectItem.projectId,
          name: projectItem.name,
          address: projectItem.address,
        });
      });
      if (projectItems.length == 0)
        return res
          .status(404)
          .json({ error: "No more projects for the requested page" });
      res.status(200).json(projectList);
    } catch (e) {
      if (e === "negative page number or zero page number not allowed") {
        return res.status(400).json({ error: e.message, e });
      } else if (e === "No more projects for the requested page") {
        return res
          .status(404)
          .json({ error: "No more projects for the requested page" });
      } else return res.status(500).json({ error: e.message, e });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    if (req.session.username) {
      const projectData = req.body;
      try {
        let { projectName, address } = projectData;
        const project = await projectsData.createProject(
          req.session._id,
          req.session.username,
          projectName,
          address
        );
        return res.status(200).json(project);
      } catch (e) {
        return res.status(400).json({ error: e.message, e });
      }
    } else {
      return res
        .status(403)
        .json({
          error: "User not logged in, hence unauthorised to post a project",
        });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const project = await projectsData.getProjectById(id);
      return res.status(200).json(project);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .put(async (req, res) => {
    if (req.session.username) {
      try {
        const id = req.params.id;
        const updatedProject = await projectsData.updateProject(
          id,
          req.session._id,
          req.body
        );
        return res.status(200).json(updatedProject);
      } catch (e) {
        return res.status(500).json({ error: e });
      }
    } else {
      return res
        .status(403)
        .json({ error: "User not logged in, hence unauthorised" });
    }
  });

router.route("/:id/delete").delete(async (req, res) => {
  if (req.session.username) {
    try {
      const id = req.params.id;
      await projectsData.deleteProject(id, req.session._id);
      return res.status(200).json({ message: "Project deleted successfully" });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  } else {
    return res
      .status(403)
      .json({ error: "User not logged in, hence unauthorised" });
  }
});

module.exports = router;
