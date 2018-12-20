pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    struct Star { 
        string name; 
        string starStory;
        string ra;
        string dec;
        string mag;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => bool) public starHashMap;

    uint256 tokenCount;

    function createStar(string name, string starStory, string ra, string dec, string mag) public { 
      tokenCount++;
      uint256 tokenId = tokenCount;

      // Check star does not exist
      require(keccak256(abi.encodePacked(tokenIdToStarInfo[tokenId].dec)) == keccak256(""));

      // Check inputs
      require(keccak256(abi.encodePacked(dec)) != keccak256(""));
      require(keccak256(abi.encodePacked(ra)) != keccak256(""));
      require(keccak256(abi.encodePacked(mag)) != keccak256(""));
      require(!checkIfStarExists(ra, dec,mag));
      require(tokenId > 0);

        Star memory newStar = Star(name, starStory, ra, dec, mag);

        tokenIdToStarInfo[tokenId] = newStar;

        // Add star to starHashMap
        bytes32 hash = generateStarHash(ra, dec, mag);
        starHashMap[hash]= true;

        _mint(msg.sender, tokenId);
    }

    function putStarUpForSale(uint256 tokenId, uint256 price) public { 
        require(this.ownerOf(tokenId) == msg.sender);

        starsForSale[tokenId] = price;
    }

    function buyStar(uint256 tokenId) public payable { 
        require(starsForSale[tokenId] > 0);
        
        uint256 starCost = starsForSale[tokenId];
        address starOwner = this.ownerOf(tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, tokenId);
        _addTokenTo(msg.sender, tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExists(string ra, string dec, string mag) public view returns(bool) {    
      return starHashMap[generateStarHash(ra, dec, mag)];
    }

    function generateStarHash(string ra, string dec, string mag) private pure returns(bytes32){
      return keccak256(abi.encodePacked(ra, dec, mag));
    }

    function getStarInfo(uint256 tokenId) public view returns (string, string, string, string, string){
      return (tokenIdToStarInfo[tokenId].name, tokenIdToStarInfo[tokenId].starStory,tokenIdToStarInfo[tokenId].ra,tokenIdToStarInfo[tokenId].dec, tokenIdToStarInfo[tokenId].mag);
    }

    function mint(address to, uint256 tokenId) public{
      super._mint(msg.sender, tokenId);
    }
}
