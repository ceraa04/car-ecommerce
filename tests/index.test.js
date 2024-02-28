const { getAllBrands } = require("../controllers/indexController");
const Brand = require("../models/Brand");

jest.mock("../models/Brand");
jest.mock("../models/Car");


describe("getAllBrands", () => {
    it("returns an array of brand objects with all properties", async () => {
        // Mock Brand model behavior
        const brands = [
            {
                name: "Toyota",
                madeIn: 1910,
                description: "random description",
                url: "https://github.com/"
            },
            {
                name: "Honda",
                madeIn: 1910,
                description: "random description",
                url: "https://github.com/"
            }
        ];
        Brand.find.mockResolvedValue(brands);

        const result = await getAllBrands();

        expect(result).toEqual([
            {
                name: "Toyota",
                madeIn: 1910,
                description: "random description",
                url: "https://github.com/"
            },
            {
                name: "Honda",
                madeIn: 1910,
                description: "random description",
                url: "https://github.com/"
            }
        ]);
    });
});
