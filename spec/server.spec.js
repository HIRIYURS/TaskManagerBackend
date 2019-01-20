var Request = require("request");

describe("Test Backend",() => {
    var server;
    beforeAll(() => {
        server = require("../server");
    });
    afterAll(() => {
        server.close();
    });

    describe("GET /tasks", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:8001/tasks", (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("Test Body", () => {
            expect(data.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET Non Existent Task By ID", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:8001/tasks/123",
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Can not find Task", () => {
            expect(data.status).toBe(400);
        });
        it("Test Body", () => {
            expect(data.body).toEqual({});
        });
    });

    describe("GET Existent Task By ID", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:8001/tasks/5c3c1678d104e54960669eb8",
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Can not find Task", () => {
            expect(data.status).toBe(200);
        });
        it("Test Body", () => {
            expect(data.body._id).toEqual("5c3c1678d104e54960669eb8");
        });
    });    
});