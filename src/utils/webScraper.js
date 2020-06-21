import JSSoup from 'jssoup';

const getHtmlHandler = async (url) => {
	const proxy = 'https://cors-anywhere.herokuapp.com/'
	let htmlData = ''
	let response = await fetch(`${proxy}${url}`, {
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			"X-Requested-With": "XMLHttpRequest"
		}
	})
	switch (response.status) {
		// status "OK"
		case 200:
			htmlData = await response.text();
			break;
		// status "Not Found"
		case 404:
			console.log('Not Found');
			break;
	}
	return htmlData
}

const niceoppaiHandler = async (newUrl) => {
	console.log('niceoppaiHandler runing')
	const getAllPageUrl = (url) => {
		const urlList = []
		let cleanUrl = url.replace(/(\#\..+)/g,'').replace(/(chapter-list\/.\/)/g,'')
		let isListNotEnded = false
		for(let index=1;;index++){
			const currentUrl = `${cleanUrl}chapter-list/${index}`
			const html = await getHtmlHandler(currentUrl)
			if(html==='') break;
			const soup = new JSSoup(html)
			const chapterList = soup.findAll('li', 'lng_')
		}
	}
	getAllPageUrl(newUrl)
	// const html = await getHtmlHandler(newUrl.replace(/#.XupCTbxxfDc || #.Xu9fz9hxfDe/g,''))
	// console.log(html)
	// const soup = new JSSoup(html)
	// const chapterList = soup.findAll('li', 'lng_')

	// chapterList.forEach((eachSoup) => {
	// 	const chapterName = eachSoup.find('b','val').getText()
	// 	console.log(chapterName)
	// })
}

const webScraper = (newUrl) => {
	switch (newUrl) {
		case newUrl.match(/niceoppai/g):
			break
		default:
			niceoppaiHandler(newUrl)
			break
	}
}

export default webScraper