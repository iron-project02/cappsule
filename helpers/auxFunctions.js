const axios = require(`axios`);

exports.getImageData = async (data) => {
	try {
		return await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`, {
			"requests":[
				{
					"image":{
						"content": data
					},
					"features":[
						{
							"type":"TEXT_DETECTION",
							"maxResults":10
						}
					]
				}
			]
		});
	} catch (error) {
		console.error(error);
	};
};

function indexString(string, searchData) {
	let index       = 0,
      i           = 0,
			searchIndex = [];
			
	while (index > -1) {
			index = searchData.indexOf(string,index);
			if (index > -1) {
					searchIndex[i] = index;    
					i++;
					index ++;
			}
	}
	return searchIndex;
}

exports.sanPabloResults = data => {

	// San Pablo Drugstore search results identification
	let fspSearchIndex = `col-xs-12 col-sm-6 col-md-4`,
      fspItemIndex   = indexString(fspSearchIndex,data);

	console.log(`=> San Pablo results:\n${fspItemIndex.length}`);
	
	let imgStartString      = `<img src="`,
      imgEndString        = `" alt="`,
      linkStartString     = `<a href="`,
      linkEndString       = `">`,
      titleStartString    = `<p class="item-title">`,
      titleEndString      = `</p>`,
      subtitleStartString = `<p class="item-subtitle">`,
      subtitleEndString   = `</p>`,
      priceStartString    = `<p class="item-prize">`,
      priceEndString      = `<span class="currency">`;

  let FSPArray = [],
      pointer  = 0;
	
	for (let i = 0; i < fspItemIndex.length; i++) {

		let FSPObj = {};

		FSPObj.pharma   = `Farmacia San Pablo`;
		pointer         = data.indexOf(imgStartString, fspItemIndex[i])+imgStartString.length;
		FSPObj.image    = data.slice(pointer,data.indexOf(imgEndString,pointer));
		pointer         = data.indexOf(linkStartString, pointer) + linkEndString.length + 7;
		FSPObj.link     = `https://www.farmaciasanpablo.com.mx${data.slice(pointer,data.indexOf(linkEndString,pointer))}`;
		pointer         = data.indexOf(titleStartString, pointer) + titleStartString.length + 33;
		FSPObj.title1   = data.slice(pointer,data.indexOf(titleEndString,pointer));
		pointer         = data.indexOf(subtitleStartString, pointer) + subtitleStartString.length + 29;
		FSPObj.title2		= data.slice(pointer,data.indexOf(subtitleEndString,pointer));
		pointer         = data.indexOf(priceStartString, pointer) + priceStartString.length + 27;
		FSPObj.price    = data.slice(pointer,data.indexOf(priceEndString,pointer));
		FSPObj.title 		= `${FSPObj.title1} ${FSPObj.title2}`;
		
		FSPArray.push(FSPObj);
	}
	return FSPArray;
};

exports.delAhorroResults = data => {

	// Farmacia del Ahorro Drugstore search results identification
	let FDAArray = [];

	if (data.indexOf(`Resultados de la búsqueda`) > 0) {

		let fdaSearchProducts = `<h2 class="product-name"><a href="`,
				fdaItemIndex      = indexString(fdaSearchProducts,data);
				
		console.log(`=> Del Ahorro results:\n${fdaItemIndex.length}`);

		let fdaInitString    = `products-grid row span9`,
		    imgStartString   = `<img src="`,
		    imgEndString     = `" alt="`,
		    linkStartString  = `<h2 class="product-name"><a href="`,
		    linkEndString    = `" title="`,
		    descStartString  = `" title="`,
		    descEndString    = `">`,
		    priceStartString = `<span class="price">`,
		    priceEndString   = `</span>`;

		let pointer = data.indexOf(fdaInitString);

		for (let i = 0; i < fdaItemIndex.length; i++) {

			let FDAObj = {};

			FDAObj.pharma = `Farmacia del Ahorro`;
			pointer       = data.indexOf(imgStartString, pointer)+imgStartString.length;
			FDAObj.image  = data.slice(pointer,data.indexOf(imgEndString,pointer));
			pointer       = data.indexOf(linkStartString, pointer) + linkStartString.length;
			FDAObj.link   = data.slice(pointer,data.indexOf(linkEndString,pointer));
			pointer       = data.indexOf(descStartString, pointer) + descStartString.length;
			FDAObj.title  = data.slice(pointer,data.indexOf(descEndString,pointer));
			pointer       = data.indexOf(priceStartString, pointer) + priceStartString.length + 1;
			FDAObj.price  = data.slice(pointer,data.indexOf(priceEndString,pointer));

			FDAArray.push(FDAObj);
		}
	}
	return FDAArray;
};

exports.getSanPablo = query => {
	return axios.get(`https://farmaciasanpablo.com.mx/search/?sort=price-asc&q=${query}`);
};

exports.getAhorro = query => {
	return axios.get(`http://www.fahorro.com/catalogsearch/result/index/?dir=asc&order=price&q=${query}`);
};

