const hre = require("hardhat")
const fs = require('fs')

async function main() {
  const Main = await hre.ethers.getContractFactory("Main")
  const main = await Main.deploy()

  await main.deployed();

  console.log("Main deployed to:", main.address);
  fs.writeFileSync('./config.js', `export const contractAddress = "${main.address}"`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
