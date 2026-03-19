const BackpackToken = artifacts.require("BackpackToken");

contract("BackpackToken", accounts => {
    it("should deploy the BackpackToken contract", async () => {
        const instance = await BackpackToken.deployed();
        assert(instance.address !== '');
    });
});