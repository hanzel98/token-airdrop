// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenAirdropWithAmount {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    bytes32 public immutable merkleRoot;

    mapping(address => bool) public claimed;

    event Claim(address indexed claimer, uint256 amount);

    constructor(IERC20 _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }

    function claim(bytes32[] calldata merkleProof, uint256 amount) external {
        require(
            canClaim(msg.sender, amount, merkleProof),
            "TokenAirdrop: Address or amount are invalid for claim"
        );
        claimed[msg.sender] = true;
        token.safeTransfer(msg.sender, amount);
        emit Claim(msg.sender, amount);
    }

    function canClaim(
        address claimer,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) public view returns (bool) {
        return
            !claimed[claimer] &&
            MerkleProof.verify(
                merkleProof,
                merkleRoot,
                keccak256(abi.encodePacked(claimer, amount))
            );
    }
}
