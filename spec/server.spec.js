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
    
    describe("Add Task", () => {
        var data = {};
        var taskname = "My Unit Test Task " + new Date();
        var start_date = new Date("01-20-2019");
        var end_date = new Date("01-31-2019");
        beforeAll((done) => {
            Request.post("http://localhost:8001/tasks/add", 
                         {
                            json: {
                                "task": taskname,
                                "start_date": start_date,
                                "end_date": end_date,
                                "priority": "12",
                                "parent": "5c3c1678d104e54960669eb8" 
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                console.log("Body: ", body);
                console.log("typeof(body): ", typeof(body));
                data.body = JSON.parse(JSON.stringify(body));
                console.log("typeof Data Body: ", typeof(data.body));
                console.log("Data Body: ", data.body);
                console.log("Data Body.issue: ", data.body.issue);
                done();
            });
        });

        it("Add Task Request Status", () => {
            expect(data.status).toBe(200);
        });
        it("Add Task Message Body", () => {
             expect(data.body.issue).toEqual("Added Successfully");
        });
    });

});