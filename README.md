# Blockchain Developer Bootcamp Final Project

To facilitate the sale and purchase of digital stock photos without the need for a centralized agency.

## Issue
The stock photography industry is an oligopoly controlled by a small number of agencies like [Shutterstock](https://www.shutterstock.com/) and [Getty Images](https://www.gettyimages.com/).  These companies take a hefty commission to facilitate digital use license sales between stock photographers and licensors of stock photography.  

## Solution
Licencing stock photography can be done more efficiently using blockchain technology.  This project will disintermediate existing stock photography agencies by using smart contracts to sell digital use licenses directly from stock photographers to buyers.

## Stock Photographers (Photog) Example Workflow
1. Photog uploads a stock photo file to [IPFS](https://ipfs.io/).
2. Photog uploads a photo metadata JSON file to [IPFS](https://ipfs.io/).
3. Photog interacts with smart contract to register the photo for sale.  The photographer provides the following information:
* Photo IPFSHash
* Metadata IPFSHash
* Purchase Price

## Stock Photography Licenser Example Workflow
1. Licenser sends price to the smart contract
2. Price is distributed to the photog
3. Licensor receives proof of licence 

## Potential Additional Features
- Ability to search a collection of photos for sale based on photo metadata.
- Ability to share revenue from a photo sale with different people at specific percentages.
- Ability to only access the photo file if a licence has been purchased.
- Ability to accept different cryptocurrencies / tokens for purchase.