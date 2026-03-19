const Governance = artifacts.require("Governance");

contract("Governance", accounts => {
    it("should deploy the Governance contract", async () => {
        const instance = await Governance.deployed();
        assert(instance.address !== '');
    });
});