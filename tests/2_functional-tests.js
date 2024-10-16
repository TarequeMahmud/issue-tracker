const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("GET /api/issues/{project} - View issues for a project", function () {
    //get-1
    test("View issues on a project", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array");
          res.body.forEach((element) => {
            assert.isObject(element, "elements should be objects");
          });
          done();
        });
    });
    //get-2
    test("View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest?open=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array");
          res.body.forEach((element) => {
            assert.isObject(element, "elements should be objects");
            assert.equal(element.open, true);
          });
          done();
        });
    });
    //get-3
    test("View issues on a project with multiple filters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest?open=true&issue_title=dfadsf")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array");
          res.body.forEach((element) => {
            assert.isObject(element, "elements should be objects");
            assert.equal(element.open, true);
            assert.equal(element.issue_title, "dfadsf");
          });
          done();
        });
    });
  });

  suite("POST /api/issues/{project} - Create a new issue", () => {
    //post-1
    test("Create an issue with every field", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "New Issue",
          issue_text: "test",
          created_by: "Tester",
          assigned_to: "This is a test issue",
          status_text: "In Progress",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "issue_title",
            "Issue object should have a title"
          );
          assert.property(
            res.body,
            "issue_text",
            "Issue object should have issue text"
          );
          assert.property(
            res.body,
            "created_by",
            "Issue object should have created by"
          );
          assert.property(
            res.body,
            "assigned_to",
            "Issue object should have assigned to"
          );
          assert.property(
            res.body,
            "status_text",
            "Issue object should have status text"
          );
          done();
        });
    });
    //post-2
    test("Create an issue with only required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "New Issue",
          issue_text: "test",
          created_by: "Tester",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "issue_title",
            "Issue object should have a title"
          );
          assert.property(
            res.body,
            "issue_text",
            "Issue object should have issue text"
          );
          assert.property(
            res.body,
            "created_by",
            "Issue object should have created by"
          );

          done();
        });
    });
    //post-3
    test("Create an issue with missing required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "New Issue",
          issue_text: "test",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "error",
            "response should have an error property"
          );
          assert.equal(res.body.error, "required field(s) missing");

          done();
        });
    });
  });
  suite("PUT /api/issues/{project} - Update an issue", () => {
    //put-1
    test("Update one field on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "670bf185b096400780e62a27",
          open: "true",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "result", "response should have an result");
          assert.property(res.body, "_id", "response should have the id");
          assert.equal(res.body._id, "670bf185b096400780e62a27");
          assert.equal(res.body.result, "successfully updated");

          done();
        });
    });
    //put-2
    test("Update multiple fields on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "670bf185b096400780e62a27",
          issue_title: "dfadsfa",
          issue_text: "dasfdsafa",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "result", "response should have an result");
          assert.property(res.body, "_id", "response should have the id");
          assert.equal(res.body._id, "670bf185b096400780e62a27");
          assert.equal(res.body.result, "successfully updated");

          done();
        });
    });
    //put-3
    test("Update an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          issue_title: "dfadsfa",
          issue_text: "dasfdsafa",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "error", "response should have an error");
          assert.equal(res.body.error, "missing _id");

          done();
        });
    });
    //put-4
    test("Update an issue with no fields to update", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "670bf185b096400780e62a27",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "error", "response should have an error");
          assert.property(res.body, "_id", "response should have the id");
          assert.equal(res.body._id, "670bf185b096400780e62a27");
          assert.equal(res.body.error, "no update field(s) sent");

          done();
        });
    });
    //put-5
    test("Update an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "67abf185b096400780e6212z",
          issue_title: "dfadsfa",
          issue_text: "dasfdsafa",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "error", "response should have an error");
          assert.property(res.body, "_id", "response should have the id");
          assert.equal(res.body._id, "67abf185b096400780e6212z");
          assert.equal(res.body.error, "could not update");

          done();
        });
    });
  });
  suite("DELETE /api/issues/{project} - Delete an issue'", () => {
    //delete-1
    test("Delete an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({
          _id: "670f4345fd065940e1878a75",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "result", "response should have success");
          assert.property(res.body, "_id", "response should have the id");
          assert.equal(res.body._id, "670f4345fd065940e1878a75");
          assert.equal(res.body.result, "successfully deleted");

          done();
        });
    });
    //delete-2
    test("Delete an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({
          _id: "670f3df31e5c3c769f341c92",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "error", "response should have success");
          assert.property(res.body, "_id", "response should have the id");
          assert.equal(res.body._id, "670f3df31e5c3c769f341c92");
          assert.equal(res.body.error, "could not delete");

          done();
        });
    });
    //delete-3
    test("Delete an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "error", "response should have success");
          assert.equal(res.body.error, "missing _id");

          done();
        });
    });
  });
});
