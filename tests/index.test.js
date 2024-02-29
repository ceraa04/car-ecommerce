const { getAllBrands } = require("../controllers/indexController");
const Brand = require("../models/Brand");

jest.mock("../models/Brand", () => ({
    find: jest.fn(),
    findOne: jest.fn(),
}));

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
        // get all brands vraca samo nazive brendova, ne cele objekte
        const result = await getAllBrands();

        expect(result).toEqual(["Toyota", "Honda"]);
    });
});
