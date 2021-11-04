### Token URI


The token URI contains all information about the photo for sale and is a JSON file in the format of the the [official ERC721 metadata standard](https://eips.ethereum.org/EIPS/eip-721#specification) with the [ERC1155 metadata suggestions](https://eips.ethereum.org/EIPS/eip-1155#metadata).  This format is supported by many NFT marketplaces including the popular [Opensea market](https://docs.opensea.io/docs/metadata-standards).

Here is an example of the base metadata
```
{
  "name": "Moraine Lake Sunrise",
  "description": "One of the most beautiful (and photographed) lakes in Canada, Moraine Lake.", 
  "external_url": "https://www.souvenirpixels.com/James-wheeler-portfolio/i-bwQmQXt/A", 
  "image": "https://photos.smugmug.com/Photo-blog/i-bwQmQXt/1/c77946e4/XL/2012-07-31%20051814%20-%20Moraine%20Lake%20Sunrise-XL.jpg", 
  "properties": [ ... ], 
}
```
Each of these primary properties will be used be used to display the image on stock licencing sites.
| Property Name | Notes |
| ------------- | ----------- |
| Name | This is the name of the asset, will often be used as a title and for SEO |
| Description | Will be shown accompanying the image |
| external_url | This is a link to a page where the photo can be licences.  Most marketplaces won't support licencable NFTs initially but many will provide this link buyers.  So, this should be a direct link to a photo that support licencable NFTs |
| Image | This is the image that will be displayed to the buyer.  This can be copywrited for the photographers protection if needed. |
| animation_url | Typically used for footage.  A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV, and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA. |

In addition to these primary properties, it is strongly recommended that these optional properties are included in the "properties" section, for example:

```
{
    "name": "Moraine Lake Sunrise",
    "description": "One of the most beautiful (and photographed) lakes in Canada, Moraine Lake.", 
    "external_url": "https://www.souvenirpixels.com/James-wheeler-portfolio/i-bwQmQXt/A", 
    "image": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j", 
    "animation_url": "",
    "ldap_metadata_version": "0.1",
    "sizes": {
      "image_120px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "image_240px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "image_480px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "image_960px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "image_1920px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "image_3840px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "animation_url_120px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "animation_url_240px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "animation_url_480px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "animation_url_960px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "animation_url_1920px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j",
      "animation_url_3840px": "ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j"
    },
    "properties": 
      {
        "keywords": {
            "name": "Keywords",
            "display_type": "array",
            "value": ["alberta", "aqua", "banff", "beautiful", "blue", "calm", "canada",
                        "canadian", "clouds", "colorful", "lake", "landscape", "moraine", 
                        "morning", "mountains", "nature", "peaceful", "peaks", "reflection", 
                        "rockies", "rocky", "scenic", "sunrise", "tranquil", "travel", 
                        "turquoise", "vivid", "outdoor", "tourism", "hiking", "serenity", 
                        "emerald", "pristine", "lake louise", "amazing", "hdr"]
        },
        "creation_date": {
            "name": "Creation Date",
            "display_type": "date",
            "value": "2021-11-04T03:55:30Z"
        },
        "asset_type": {
            "name": "Type",
            "display_type": "string",
            "value": "Photo"
        },
        "pixel_height": {
            "name": "Pixel Height",
            "display_type": "number",
            "value": "2847"
        },
        "pixel_width": {
            "name": "Pixel Width",   
            "display_type": "number",
            "value": "4226"
        },
        "usage": {
            "name": "Usage",
            "display_type": "string",
            "value": "Commercial"
        },
        "number_of_people": {
            "name": "Number of People",
            "display_type": "number",
            "value": "0"
        }
    }
}  
```

These properties will be used by search engines so including them in the proper format will increase your sales of licences.

| Property Name | Notes |
| ------------- | ----------- |
| Keywords | All keywords describing the file, separated by commas.  Only the first 50 will be used for search engines. |
|  | Creation date time in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). 
| Type | Must be Photo, Vector, Footage, Music, Template, or 3D Model |
| Pixel Height | Height of the asset. Only used for photo and footage. |
| Pixel Width | Width of the asset. Only used for photo and footage. |
| Usage | Commercial or Editorial.  Commercial usages must have applicable model and property releases available. |
| Number of People | Typically used for photos and footage, buyers can filter buy number of people they are looking for.  |

### Storage Options

Asset file and metadata JSON files are stored offchain in one of the following options

1. Web2 URL - Standard web URL, including http or https
2. [IPFS](https://ipfs.io/) - Format should be ipfs://<hash>. For example, ipfs://QmWnQHrg2HeYq9ZGMVk16YH6NzzZubKfZEPEUSvuoj2NXw
3. [ARWeave](https://www.arweave.org/) - Format should be ar://<hash>. For example, ar://CWaRlnQ4oMZbV1hupldUr_90Toax4Tv2J2xGdGF0UjE