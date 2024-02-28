const { getAllBrands } = require("../controllers/indexController");
const Brand = require("../models/Brand");

jest.mock("../models/Brand");

describe("getAllBrands", () => {
    it("returns an array of brand names", async () => {
        // Mock Brand model behavior
        const brands = [{ name: "Toyota" }, { name: "Honda" }];
        require("../models/Brand").find.mockResolvedValue(brands);

        const result = await getAllBrands();
        expect(result).toEqual(["Toyota", "Honda"]);
    });

});
