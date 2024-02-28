const request = require("supertest");
const app = require("../routes/index");

describe("GET /", () => {
    test("responds with status 200 INDEX", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    }, 10000); // 10 seconds timeout
});

describe("GET /contact", () => {
    test("responds with status 200 CONTACT", async () => {
        const response = await request(app).get("/contact");
        expect(response.statusCode).toBe(200);
    }, 10000); // 10 seconds timeout
});

describe("GET /about", () => {
    test("responds with status 200 ABOUT", async () => {
        const response = await request(app).get("/about");
        expect(response.status).toBe(200);
    }, 10000); // 10 seconds timeout
});

describe("GET /products", () => {
    test("responds with status 200 PRODUCTS", async () => {
        const response = await request(app).get("/products");
        expect(response.status).toBe(200);
    }, 10000); // 10 seconds timeout
});
