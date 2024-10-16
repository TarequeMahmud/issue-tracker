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
});
