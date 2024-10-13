"use strict";

const Issue = require("../schema/issueSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const {
        issue_title: issueTitle,
        issue_text: issueText,
        created_by: createdBy,
        assigned_to: assignedTo,
        status_text: statusText,
      } = req.body;
      if (!issueTitle || !issueText || !createdBy) {
        return res.json({ error: "required field(s) missing" });
      }
      const issue = {
        project: project,
        issue_title: issueTitle,
        issue_text: issueText,
        created_by: createdBy,
        assigned_to: assignedTo,
        status_text: statusText,
      };
      console.log(issue);

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
