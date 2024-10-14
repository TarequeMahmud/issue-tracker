"use strict";

const Issue = require("../schema/issueSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let filter = req.query;
      if (filter.open) {
        filter.open = filter.open === "true" ? true : false;
      }

      filter.project = req.params.project;
      console.log(req.params.project);

      try {
        const findIssues = await Issue.find(filter).select("-project");

        const data = [...findIssues];
        return res.json(data);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "had error getting issue array" });
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }
      const issue = {
        project: project,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      };

      try {
        const newIssue = Issue(issue);
        const saveIssue = await newIssue.save();

        return res.json({
          project: saveIssue.project,
          issue_title: saveIssue.issue_title,
          issue_text: saveIssue.issue_text,
          created_by: saveIssue.created_by,
          assigned_to: saveIssue.assigned_to || "",
          status_text: saveIssue.status_text || "",
          created_on: saveIssue.created_on,
          updated_on: saveIssue.updated_on,
          open: saveIssue.open,
          _id: saveIssue._id,
        });
      } catch (error) {
        console.log(error);
        res.json(error);
      }
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
