/**
 * Mintlay Contract Compiler
 * Run: node compile.mjs
 * Output: artifacts/MintlayNFT.json, artifacts/MintlayToken.json
 *
 * Requires: npm install solc@0.8.20
 */

import solc from "solc";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function compile(contractName) {
  const source = readFileSync(join(__dirname, "src", `${contractName}.sol`), "utf8");

  const input = {
    language: "Solidity",
    sources: { [`${contractName}.sol`]: { content: source } },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": { "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"] },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors?.some((e) => e.severity === "error")) {
    console.error("Compilation errors:", output.errors);
    process.exit(1);
  }

  const contract = output.contracts[`${contractName}.sol`][contractName];
  return {
    contractName,
    abi: contract.abi,
    bytecode: "0x" + contract.evm.bytecode.object,
    deployedBytecode: "0x" + contract.evm.deployedBytecode.object,
  };
}

mkdirSync(join(__dirname, "artifacts"), { recursive: true });

for (const name of ["MintlayNFT", "MintlayToken"]) {
  const artifact = compile(name);
  writeFileSync(
    join(__dirname, "artifacts", `${name}.json`),
    JSON.stringify(artifact, null, 2),
  );
  console.log(`✓ Compiled ${name} (${artifact.bytecode.length / 2} bytes)`);
}

console.log("\n✓ Artifacts written to packages/contracts/artifacts/");
