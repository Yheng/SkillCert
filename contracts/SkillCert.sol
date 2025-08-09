// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkillCert
 * @dev Smart contract for issuing and verifying blockchain-based skill credentials
 */
contract SkillCert is ReentrancyGuard, Ownable {
    
    uint256 private _credentialIds;
    
    // Credential structure
    struct Credential {
        uint256 id;
        address recipient;
        address issuer;
        string skill;
        string ipfsHash;
        uint256 timestamp;
        bool isActive;
        string metadata; // JSON string with additional data
    }
    
    // Mapping from credential ID to credential
    mapping(uint256 => Credential) public credentials;
    
    // Mapping from recipient address to list of credential IDs
    mapping(address => uint256[]) public userCredentials;
    
    // Mapping to track authorized issuers (educators)
    mapping(address => bool) public authorizedIssuers;
    
    // Mapping to track if a skill + IPFS hash combination already exists
    mapping(bytes32 => bool) private usedProofs;
    
    // Events
    event CredentialIssued(
        uint256 indexed credentialId,
        address indexed recipient,
        address indexed issuer,
        string skill,
        string ipfsHash
    );
    
    event CredentialRevoked(
        uint256 indexed credentialId,
        address indexed revoker
    );
    
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    // Modifiers
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner(), "Not authorized to issue credentials");
        _;
    }
    
    modifier credentialExists(uint256 credentialId) {
        require(credentialId > 0 && credentialId <= _credentialIds, "Credential does not exist");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // Owner is automatically authorized to issue credentials
        authorizedIssuers[msg.sender] = true;
        _credentialIds = 0;
    }
    
    /**
     * @dev Issue a new credential
     * @param recipient Address of the credential recipient
     * @param skill Name of the skill being certified
     * @param ipfsHash IPFS hash of the proof/evidence
     * @param metadata Additional metadata as JSON string
     */
    function issueCredential(
        address recipient,
        string memory skill,
        string memory ipfsHash,
        string memory metadata
    ) external onlyAuthorizedIssuer nonReentrant returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(skill).length > 0, "Skill cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        // Generate unique identifier for proof
        bytes32 proofId = keccak256(abi.encodePacked(skill, ipfsHash, recipient));
        require(!usedProofs[proofId], "This proof has already been used");
        
        _credentialIds++;
        uint256 newCredentialId = _credentialIds;
        
        credentials[newCredentialId] = Credential({
            id: newCredentialId,
            recipient: recipient,
            issuer: msg.sender,
            skill: skill,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            isActive: true,
            metadata: metadata
        });
        
        userCredentials[recipient].push(newCredentialId);
        usedProofs[proofId] = true;
        
        emit CredentialIssued(newCredentialId, recipient, msg.sender, skill, ipfsHash);
        
        return newCredentialId;
    }
    
    /**
     * @dev Verify if a credential is valid and active
     * @param credentialId ID of the credential to verify
     */
    function verifyCredential(uint256 credentialId) 
        external 
        view 
        credentialExists(credentialId) 
        returns (bool isValid, Credential memory credential) 
    {
        credential = credentials[credentialId];
        isValid = credential.isActive;
        return (isValid, credential);
    }
    
    /**
     * @dev Get all credentials for a specific user
     * @param user Address of the user
     */
    function getUserCredentials(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userCredentials[user];
    }
    
    /**
     * @dev Get detailed information about multiple credentials
     * @param credentialIds Array of credential IDs
     */
    function getCredentialsBatch(uint256[] memory credentialIds)
        external
        view
        returns (Credential[] memory)
    {
        Credential[] memory result = new Credential[](credentialIds.length);
        
        for (uint256 i = 0; i < credentialIds.length; i++) {
            if (credentialIds[i] > 0 && credentialIds[i] <= _credentialIds) {
                result[i] = credentials[credentialIds[i]];
            }
        }
        
        return result;
    }
    
    /**
     * @dev Revoke a credential (can only be done by issuer or owner)
     * @param credentialId ID of the credential to revoke
     */
    function revokeCredential(uint256 credentialId) 
        external 
        credentialExists(credentialId) 
    {
        Credential storage credential = credentials[credentialId];
        require(
            msg.sender == credential.issuer || msg.sender == owner(),
            "Only issuer or contract owner can revoke"
        );
        require(credential.isActive, "Credential already revoked");
        
        credential.isActive = false;
        
        emit CredentialRevoked(credentialId, msg.sender);
    }
    
    /**
     * @dev Authorize an address to issue credentials
     * @param issuer Address to authorize
     */
    function authorizeIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        authorizedIssuers[issuer] = true;
        
        emit IssuerAuthorized(issuer);
    }
    
    /**
     * @dev Revoke issuer authorization
     * @param issuer Address to revoke authorization from
     */
    function revokeIssuer(address issuer) external onlyOwner {
        require(issuer != owner(), "Cannot revoke owner authorization");
        authorizedIssuers[issuer] = false;
        
        emit IssuerRevoked(issuer);
    }
    
    /**
     * @dev Check if an address is authorized to issue credentials
     * @param issuer Address to check
     */
    function isAuthorizedIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }
    
    /**
     * @dev Get total number of issued credentials
     */
    function getTotalCredentials() external view returns (uint256) {
        return _credentialIds;
    }
    
    /**
     * @dev Get credentials by skill type
     * @param skill Skill name to filter by
     * @param offset Starting position for pagination
     * @param limit Maximum number of results to return
     */
    function getCredentialsBySkill(
        string memory skill,
        uint256 offset,
        uint256 limit
    ) external view returns (Credential[] memory) {
        require(limit > 0 && limit <= 100, "Limit must be between 1 and 100");
        
        uint256 total = _credentialIds;
        uint256 found = 0;
        uint256 processed = 0;
        
        // First pass: count matching credentials
        for (uint256 i = 1; i <= total && processed < offset + limit; i++) {
            if (keccak256(bytes(credentials[i].skill)) == keccak256(bytes(skill)) && 
                credentials[i].isActive) {
                if (processed >= offset) {
                    found++;
                }
                processed++;
            }
        }
        
        // Second pass: collect matching credentials
        Credential[] memory result = new Credential[](found);
        uint256 resultIndex = 0;
        processed = 0;
        
        for (uint256 i = 1; i <= total && resultIndex < found; i++) {
            if (keccak256(bytes(credentials[i].skill)) == keccak256(bytes(skill)) && 
                credentials[i].isActive) {
                if (processed >= offset) {
                    result[resultIndex] = credentials[i];
                    resultIndex++;
                }
                processed++;
            }
        }
        
        return result;
    }
}