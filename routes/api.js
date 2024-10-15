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

      try {
        const findIssues = await Issue.find(filter).select("-project");
        if (!findIssues) return res.json({ error: "could not update" });

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

    .put(async function (req, res) {
      let project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open = undefined,
      } = req.body;
      if (!_id) return res.json({ error: "missing _id" });

      const fields = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      };

      const filteredFields = {};
      for (let key in fields) {
        if (
          fields.hasOwnProperty(key) &&
          fields[key] !== "" &&
          fields[key] !== undefined
        ) {
          filteredFields[key] = fields[key];
        }
      }

      if (Object.keys(filteredFields).length === 0) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }

      try {
        const doc = await Issue.findById(_id);

        if (!doc) return res.json({ error: "could not update", _id: _id });
        for (let key in filteredFields) {
          doc[key] = filteredFields[key];
        }

        await doc.save();
        res.json({ result: "successfully updated", _id: _id });
      } catch (error) {
        console.error(error);
        return res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;
      if (!_id) return res.json({ error: "missing _id" });
      try {
        const del = await Issue.findByIdAndDelete(_id);
        if (!del) return res.json({ error: "could not delete", _id: _id });
        return res.json({ result: "successfully deleted", _id: _id });
      } catch (error) {
        return res.json({ error: "could not delete", _id: _id });
      }
    });
};
