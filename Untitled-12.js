const PointToken = artifacts.require("PointToken");

contract("PointToken", accounts => {
    it("should deploy the PointToken contract", async () => {
        const instance = await PointToken.deployed();
        assert(instance.address !== '');
    });
});