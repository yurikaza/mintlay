/**
 * Mintlay Contract Artifacts
 *
 * ABIs are derived from packages/contracts/src/*.sol
 * Bytecode is compiled by running: pnpm --filter @mintlay/contracts compile
 *
 * After compilation, replace the bytecode strings below with the output from
 * packages/contracts/artifacts/MintlayNFT.json and MintlayToken.json
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ContractArtifact {
  contractName: string;
  abi: readonly object[];
  /** Hex bytecode. "0x" means not yet compiled — run `pnpm --filter @mintlay/contracts compile` */
  bytecode: `0x${string}`;
}

// ── MintlayNFT ABI ────────────────────────────────────────────────────────────

export const MINTLAY_NFT_ABI = [
  // Constructor
  { type: "constructor", inputs: [
    { name: "_name",         type: "string"  },
    { name: "_symbol",       type: "string"  },
    { name: "_maxSupply",    type: "uint256" },
    { name: "_mintPrice",    type: "uint256" },
    { name: "_maxPerWallet", type: "uint256" },
    { name: "_royaltyBPS",   type: "uint96"  },
    { name: "_baseTokenURI", type: "string"  },
  ], stateMutability: "nonpayable" },

  // View / Pure
  { name: "name",             type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "string"  }] },
  { name: "symbol",           type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "string"  }] },
  { name: "maxSupply",        type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "uint256" }] },
  { name: "totalSupply",      type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "uint256" }] },
  { name: "mintPrice",        type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "uint256" }] },
  { name: "maxPerWallet",     type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "uint256" }] },
  { name: "royaltyBPS",       type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "uint96"  }] },
  { name: "saleActive",       type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "bool"    }] },
  { name: "owner",            type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "address" }] },
  { name: "baseTokenURI",     type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "string"  }] },
  { name: "balanceOf",        type: "function", stateMutability: "view",      inputs: [{ name: "account",  type: "address" }],                                            outputs: [{ name: "", type: "uint256" }] },
  { name: "ownerOf",          type: "function", stateMutability: "view",      inputs: [{ name: "tokenId",  type: "uint256" }],                                            outputs: [{ name: "", type: "address" }] },
  { name: "tokenURI",         type: "function", stateMutability: "view",      inputs: [{ name: "tokenId",  type: "uint256" }],                                            outputs: [{ name: "", type: "string"  }] },
  { name: "getApproved",      type: "function", stateMutability: "view",      inputs: [{ name: "tokenId",  type: "uint256" }],                                            outputs: [{ name: "", type: "address" }] },
  { name: "isApprovedForAll", type: "function", stateMutability: "view",      inputs: [{ name: "account",  type: "address" }, { name: "operator",  type: "address" }],    outputs: [{ name: "", type: "bool"    }] },
  { name: "mintedPerWallet",  type: "function", stateMutability: "view",      inputs: [{ name: "",         type: "address" }],                                            outputs: [{ name: "", type: "uint256" }] },
  { name: "royaltyInfo",      type: "function", stateMutability: "view",      inputs: [{ name: "",         type: "uint256" }, { name: "salePrice",  type: "uint256" }],   outputs: [{ name: "", type: "address" }, { name: "", type: "uint256" }] },
  { name: "supportsInterface",type: "function", stateMutability: "pure",      inputs: [{ name: "interfaceId", type: "bytes4" }],                                          outputs: [{ name: "", type: "bool"    }] },

  // Writes
  { name: "mint",              type: "function", stateMutability: "payable",    inputs: [{ name: "quantity",  type: "uint256" }],                                          outputs: [] },
  { name: "ownerMint",         type: "function", stateMutability: "nonpayable", inputs: [{ name: "to",        type: "address" }, { name: "quantity",  type: "uint256" }], outputs: [] },
  { name: "approve",           type: "function", stateMutability: "nonpayable", inputs: [{ name: "to",        type: "address" }, { name: "tokenId",   type: "uint256" }], outputs: [] },
  { name: "setApprovalForAll", type: "function", stateMutability: "nonpayable", inputs: [{ name: "operator",  type: "address" }, { name: "approved",  type: "bool"    }], outputs: [] },
  { name: "transferFrom",      type: "function", stateMutability: "nonpayable", inputs: [{ name: "from",      type: "address" }, { name: "to",        type: "address" }, { name: "tokenId", type: "uint256" }], outputs: [] },
  { name: "safeTransferFrom",  type: "function", stateMutability: "nonpayable", inputs: [{ name: "from",      type: "address" }, { name: "to",        type: "address" }, { name: "tokenId", type: "uint256" }], outputs: [] },
  { name: "toggleSale",        type: "function", stateMutability: "nonpayable", inputs: [],                                                                               outputs: [] },
  { name: "setBaseURI",        type: "function", stateMutability: "nonpayable", inputs: [{ name: "_baseURI",  type: "string"  }],                                         outputs: [] },
  { name: "setMintPrice",      type: "function", stateMutability: "nonpayable", inputs: [{ name: "_mintPrice",type: "uint256" }],                                         outputs: [] },
  { name: "withdraw",          type: "function", stateMutability: "nonpayable", inputs: [],                                                                               outputs: [] },
  { name: "transferOwnership", type: "function", stateMutability: "nonpayable", inputs: [{ name: "newOwner",  type: "address" }],                                         outputs: [] },

  // Events
  { name: "Transfer",        type: "event", inputs: [{ name: "from",     type: "address", indexed: true }, { name: "to",       type: "address", indexed: true }, { name: "tokenId",  type: "uint256", indexed: true }] },
  { name: "Approval",        type: "event", inputs: [{ name: "owner",    type: "address", indexed: true }, { name: "approved", type: "address", indexed: true }, { name: "tokenId",  type: "uint256", indexed: true }] },
  { name: "ApprovalForAll",  type: "event", inputs: [{ name: "owner",    type: "address", indexed: true }, { name: "operator", type: "address", indexed: true }, { name: "approved", type: "bool",    indexed: false }] },
  { name: "SaleToggled",     type: "event", inputs: [{ name: "active",   type: "bool",    indexed: false }] },
  { name: "BaseURIUpdated",  type: "event", inputs: [{ name: "newURI",   type: "string",  indexed: false }] },
  { name: "Withdrawn",       type: "event", inputs: [{ name: "to",       type: "address", indexed: false }, { name: "amount", type: "uint256", indexed: false }] },
] as const;

// ── MintlayToken ABI ──────────────────────────────────────────────────────────

export const MINTLAY_TOKEN_ABI = [
  { type: "constructor", inputs: [
    { name: "_name",          type: "string"  },
    { name: "_symbol",        type: "string"  },
    { name: "_initialSupply", type: "uint256" },
  ], stateMutability: "nonpayable" },

  // View
  { name: "name",             type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "string"  }] },
  { name: "symbol",           type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "string"  }] },
  { name: "decimals",         type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "uint8"   }] },
  { name: "totalSupply",      type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "uint256" }] },
  { name: "owner",            type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "address" }] },
  { name: "mintingFinished",  type: "function", stateMutability: "view",      inputs: [],                                                                                  outputs: [{ name: "", type: "bool"    }] },
  { name: "balanceOf",        type: "function", stateMutability: "view",      inputs: [{ name: "",          type: "address" }],                                            outputs: [{ name: "", type: "uint256" }] },
  { name: "allowance",        type: "function", stateMutability: "view",      inputs: [{ name: "",          type: "address" }, { name: "",           type: "address" }],  outputs: [{ name: "", type: "uint256" }] },

  // Write
  { name: "transfer",         type: "function", stateMutability: "nonpayable", inputs: [{ name: "to",        type: "address" }, { name: "amount",     type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { name: "approve",          type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender",   type: "address" }, { name: "amount",     type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { name: "transferFrom",     type: "function", stateMutability: "nonpayable", inputs: [{ name: "from",      type: "address" }, { name: "to",         type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { name: "mint",             type: "function", stateMutability: "nonpayable", inputs: [{ name: "to",        type: "address" }, { name: "amount",     type: "uint256" }], outputs: [] },
  { name: "burn",             type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount",    type: "uint256" }],                                          outputs: [] },
  { name: "finishMinting",    type: "function", stateMutability: "nonpayable", inputs: [],                                                                               outputs: [] },
  { name: "transferOwnership",type: "function", stateMutability: "nonpayable", inputs: [{ name: "newOwner",  type: "address" }],                                         outputs: [] },

  // Events
  { name: "Transfer",           type: "event", inputs: [{ name: "from",            type: "address", indexed: true }, { name: "to",       type: "address", indexed: true }, { name: "value", type: "uint256", indexed: false }] },
  { name: "Approval",           type: "event", inputs: [{ name: "owner",           type: "address", indexed: true }, { name: "spender",  type: "address", indexed: true }, { name: "value", type: "uint256", indexed: false }] },
  { name: "OwnershipTransferred",type: "event", inputs: [{ name: "previousOwner",  type: "address", indexed: true }, { name: "newOwner", type: "address", indexed: true }] },
  { name: "MintingFinished",    type: "event", inputs: [] },
] as const;

// ── Artifacts ────────────────────────────────────────────────────────────────
// Bytecode is populated after running: pnpm --filter @mintlay/contracts compile
// The compile script outputs artifacts/MintlayNFT.json and artifacts/MintlayToken.json.
// Paste the "bytecode" field from each JSON here.

export const MINTLAY_NFT_ARTIFACT: ContractArtifact = {
  contractName: "MintlayNFT",
  abi: MINTLAY_NFT_ABI,
  // After compiling: replace with artifact bytecode from packages/contracts/artifacts/MintlayNFT.json
  bytecode: "0x",
};

export const MINTLAY_TOKEN_ARTIFACT: ContractArtifact = {
  contractName: "MintlayToken",
  abi: MINTLAY_TOKEN_ABI,
  // After compiling: replace with artifact bytecode from packages/contracts/artifacts/MintlayToken.json
  bytecode: "0x",
};

// ── Deploy parameter configs for the wizard ───────────────────────────────────

export interface DeployParam {
  key: string;
  label: string;
  description: string;
  type: "text" | "number" | "eth";
  placeholder: string;
  required: boolean;
  defaultValue?: string;
}

export interface DeployConfig {
  artifact: ContractArtifact;
  label: string;
  icon: string;
  description: string;
  category: "NFT" | "Token" | "DAO";
  params: DeployParam[];
  /** Maps param keys to constructor arg order */
  buildArgs: (params: Record<string, string>, chainId: number) => unknown[];
}

export const DEPLOY_CONFIGS: DeployConfig[] = [
  {
    artifact: MINTLAY_NFT_ARTIFACT,
    label: "NFT Collection",
    icon: "🎨",
    description: "Deploy a fully on-chain ERC-721 NFT collection with public mint, royalties, and admin controls.",
    category: "NFT",
    params: [
      { key: "name",         label: "Collection Name",    description: "The name of your NFT collection",             type: "text",   placeholder: "My NFT Collection", required: true  },
      { key: "symbol",       label: "Ticker Symbol",      description: "Short symbol, typically 3-5 uppercase letters", type: "text",   placeholder: "NFT",              required: true  },
      { key: "maxSupply",    label: "Max Supply",         description: "Maximum number of NFTs that can ever exist",   type: "number", placeholder: "10000",            required: true  },
      { key: "mintPrice",    label: "Mint Price (ETH)",   description: "Price per NFT in ETH (e.g. 0.08)",             type: "eth",    placeholder: "0.08",             required: true  },
      { key: "maxPerWallet", label: "Max Per Wallet",     description: "Maximum NFTs a single wallet can mint (0 = unlimited)", type: "number", placeholder: "5",   required: false, defaultValue: "0" },
      { key: "royaltyBPS",   label: "Royalty %",          description: "Secondary sale royalty (e.g. 5 = 5%)",         type: "number", placeholder: "5",                required: false, defaultValue: "500" },
      { key: "baseTokenURI", label: "Metadata Base URI",  description: "IPFS or HTTPS base URL for token metadata",    type: "text",   placeholder: "ipfs://QmYour.../", required: false, defaultValue: "" },
    ],
    buildArgs: (p) => [
      p.name,
      p.symbol,
      BigInt(p.maxSupply || "0"),
      BigInt(Math.round(parseFloat(p.mintPrice || "0") * 1e18)),
      BigInt(p.maxPerWallet || "0"),
      BigInt(Math.round(parseFloat(p.royaltyBPS || "500"))),
      p.baseTokenURI || "",
    ],
  },
  {
    artifact: MINTLAY_TOKEN_ARTIFACT,
    label: "ERC-20 Token",
    icon: "🪙",
    description: "Deploy a fungible ERC-20 token with initial supply, minting, and burn capabilities.",
    category: "Token",
    params: [
      { key: "name",          label: "Token Name",        description: "Full name of your token",                      type: "text",   placeholder: "My Token",         required: true  },
      { key: "symbol",        label: "Ticker Symbol",     description: "Short symbol (e.g. MTK)",                      type: "text",   placeholder: "MTK",              required: true  },
      { key: "initialSupply", label: "Initial Supply",    description: "Number of tokens minted to your wallet on deploy (human-readable, e.g. 1000000)", type: "number", placeholder: "1000000", required: true },
    ],
    buildArgs: (p) => [
      p.name,
      p.symbol,
      BigInt(p.initialSupply || "0"),
    ],
  },
];

// ── Supported chains ──────────────────────────────────────────────────────────

export const SUPPORTED_CHAINS = [
  { id: 1,        name: "Ethereum Mainnet",  icon: "Ξ",  color: "#627EEA", testnet: false },
  { id: 11155111, name: "Sepolia Testnet",   icon: "Ξ",  color: "#a8b8ff", testnet: true  },
  { id: 137,      name: "Polygon",           icon: "⬟",  color: "#8247E5", testnet: false },
  { id: 80001,    name: "Mumbai Testnet",    icon: "⬟",  color: "#b89dff", testnet: true  },
  { id: 8453,     name: "Base",              icon: "◉",  color: "#0052FF", testnet: false },
  { id: 84532,    name: "Base Sepolia",      icon: "◉",  color: "#6699ff", testnet: true  },
  { id: 42161,    name: "Arbitrum One",      icon: "◈",  color: "#28A0F0", testnet: false },
  { id: 10,       name: "Optimism",          icon: "⊕",  color: "#FF0420", testnet: false },
] as const;
