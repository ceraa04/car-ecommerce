const request = require("supertest");
const app = require("../routes/index");

describe("GET /", () => {
    it("responds with status 200", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });
});

describe("GET /contact", () => {
    it("responds with status 200", async () => {
        const response = await request(app).get("/contact");
        expect(response.statusCode).toBe(200);
    });
});

describe("GET /about", () => {
    it("responds with status 200", async () => {
        const response = await request(app).get("/about");
        expect(response.status).toBe(200);
    });
});