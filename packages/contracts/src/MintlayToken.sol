// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MintlayToken
 * @notice Minimal ERC-20 fungible token for Mintlay no-code deployments.
 *         Supports: transfer, approve, transferFrom, mint (owner), burn.
 */
contract MintlayToken {
    string  public name;
    string  public symbol;
    uint8   public constant decimals = 18;
    uint256 public totalSupply;
    address public owner;
    bool    public mintingFinished;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner_, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event MintingFinished();

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply   // human-readable units, multiplied by 10^18 internally
    ) {
        name   = _name;
        symbol = _symbol;
        owner  = msg.sender;
        if (_initialSupply > 0) {
            uint256 amount = _initialSupply * 10**18;
            totalSupply          = amount;
            balanceOf[msg.sender] = amount;
            emit Transfer(address(0), msg.sender, amount);
        }
    }

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    /* ── ERC-20 core ── */
    function transfer(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= amount, "Allowance exceeded");
            allowance[from][msg.sender] = allowed - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    /* ── Mint / Burn ── */
    function mint(address to, uint256 amount) public onlyOwner {
        require(!mintingFinished, "Minting finished");
        totalSupply    += amount;
        balanceOf[to]  += amount;
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        totalSupply           -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function finishMinting() public onlyOwner {
        mintingFinished = true;
        emit MintingFinished();
    }

    /* ── Admin ── */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /* ── Internal ── */
    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Zero address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        balanceOf[to]   += amount;
        emit Transfer(from, to, amount);
    }
}
