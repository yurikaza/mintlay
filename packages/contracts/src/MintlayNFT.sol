// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MintlayNFT
 * @notice Minimal ERC-721 NFT collection for Mintlay no-code deployments.
 *         Supports: mint (public payable), ownerMint, withdraw, royalties,
 *         baseURI, maxSupply, and transferOwnership.
 */
contract MintlayNFT {
    /* ── Metadata ── */
    string public name;
    string public symbol;
    string public baseTokenURI;

    /* ── Config ── */
    uint256 public maxSupply;
    uint256 public mintPrice;       // wei per token
    uint256 public maxPerWallet;
    uint96  public royaltyBPS;      // e.g. 500 = 5%

    /* ── State ── */
    uint256 public totalSupply;
    address public owner;
    bool    public saleActive;

    /* ── ERC-721 core storage ── */
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(address => uint256) public mintedPerWallet;

    /* ── Events ── */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner_, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner_, address indexed operator, bool approved);
    event SaleToggled(bool active);
    event BaseURIUpdated(string newURI);
    event Withdrawn(address to, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _maxPerWallet,
        uint96  _royaltyBPS,
        string memory _baseTokenURI
    ) {
        name          = _name;
        symbol        = _symbol;
        maxSupply     = _maxSupply;
        mintPrice     = _mintPrice;
        maxPerWallet  = _maxPerWallet == 0 ? _maxSupply : _maxPerWallet;
        royaltyBPS    = _royaltyBPS;
        baseTokenURI  = _baseTokenURI;
        owner         = msg.sender;
    }

    /* ── Modifiers ── */
    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    /* ── ERC-721 core ── */
    function balanceOf(address account) public view returns (uint256) {
        require(account != address(0), "Zero address");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token doesn't exist");
        return tokenOwner;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token doesn't exist");
        return string(abi.encodePacked(baseTokenURI, _toString(tokenId), ".json"));
    }

    function approve(address to, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner || isApprovedForAll(tokenOwner, msg.sender), "Not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "Token doesn't exist");
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator) public view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized");
        require(to != address(0), "Zero address");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata) public {
        transferFrom(from, to, tokenId);
    }

    /* ── Minting ── */
    function mint(uint256 quantity) public payable {
        require(saleActive, "Sale not active");
        require(totalSupply + quantity <= maxSupply, "Exceeds max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient ETH");
        require(mintedPerWallet[msg.sender] + quantity <= maxPerWallet, "Exceeds wallet limit");

        mintedPerWallet[msg.sender] += quantity;
        for (uint256 i = 0; i < quantity; i++) {
            _mint(msg.sender, ++totalSupply);
        }
    }

    function ownerMint(address to, uint256 quantity) public onlyOwner {
        require(totalSupply + quantity <= maxSupply, "Exceeds max supply");
        for (uint256 i = 0; i < quantity; i++) {
            _mint(to, ++totalSupply);
        }
    }

    /* ── ERC-2981 royalties ── */
    function royaltyInfo(uint256, uint256 salePrice) external view returns (address, uint256) {
        return (owner, (salePrice * royaltyBPS) / 10000);
    }

    /* ── Admin ── */
    function toggleSale() public onlyOwner {
        saleActive = !saleActive;
        emit SaleToggled(saleActive);
    }

    function setBaseURI(string calldata _baseURI) public onlyOwner {
        baseTokenURI = _baseURI;
        emit BaseURIUpdated(_baseURI);
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool ok,) = payable(owner).call{value: balance}("");
        require(ok, "Transfer failed");
        emit Withdrawn(owner, balance);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    /* ── ERC-165 ── */
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return
            interfaceId == 0x80ac58cd || // ERC-721
            interfaceId == 0x5b5e139f || // ERC-721Metadata
            interfaceId == 0x2a55205a || // ERC-2981
            interfaceId == 0x01ffc9a7;   // ERC-165
    }

    /* ── Internal helpers ── */
    function _mint(address to, uint256 tokenId) internal {
        _balances[to]++;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "Wrong owner");
        delete _tokenApprovals[tokenId];
        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address tokenOwner = ownerOf(tokenId);
        return (spender == tokenOwner || getApproved(tokenId) == spender || isApprovedForAll(tokenOwner, spender));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) { digits--; buffer[digits] = bytes1(uint8(48 + uint256(value % 10))); value /= 10; }
        return string(buffer);
    }
}
