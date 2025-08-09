import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting SkillCert deployment...");

  // Get the ContractFactory and Signers
  const SkillCert = await hre.ethers.getContractFactory("SkillCert");
  const [deployer, ...otherSigners] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", await deployer.getAddress());
  const deployerAddress = await deployer.getAddress();
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployerAddress)).toString());

  // Deploy the contract
  const skillCert = await SkillCert.deploy();
  await skillCert.waitForDeployment();

  const contractAddress = await skillCert.getAddress();
  console.log("SkillCert deployed to:", contractAddress);

  // Verify deployment
  const totalCredentials = await skillCert.getTotalCredentials();
  console.log("Initial total credentials:", totalCredentials.toString());

  // Authorize additional issuers for demo
  if (otherSigners.length > 0) {
    const educator1 = otherSigners[0];
    const educator1Address = await educator1.getAddress();
    await skillCert.authorizeIssuer(educator1Address);
    console.log("Authorized educator:", educator1Address);
  }

  // Save deployment info
  const contractsDir = path.join(__dirname, "../src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ SkillCert: contractAddress }, undefined, 2)
  );

  const SkillCertArtifact = await hre.artifacts.readArtifact("SkillCert");

  fs.writeFileSync(
    path.join(contractsDir, "SkillCert.json"),
    JSON.stringify(SkillCertArtifact, null, 2)
  );

  console.log("Contract address and ABI saved to src/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });