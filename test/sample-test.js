const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Factory", function () {
  it("Should create a new todo list", async function () {
    const Factory = await ethers.getContractFactory("Factory");
    const factory = await Factory.deploy();
    await factory.deployed();

    const createList = await factory.createNewList("Test List");
    await createList.wait();

    expect(await factory.getTodoLists()).to.equal("Test List")
  });
});