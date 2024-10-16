const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Check Get Route", function () {
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
    //test-3
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

  suite("Test Post Route", () => {
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
});
