const hre = require("hardhat")
const fs = require('fs')

async function main() {
  const TodoList = await hre.ethers.getContractFactory("TodoList")
  const todoList = await TodoList.deploy("title", "", false)

  await todoList.deployed();

  console.log("TodoList deployed to:", todoList.address);
  fs.writeFileSync('./config.js', `export const contractAddress = "${main.address}"`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
