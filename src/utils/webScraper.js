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

	//remove #x
// 	url = url.replace('http://www.','').split('/')
// 	url.splice(url.length-1,url.length-1)

	const html = await getHtmlHandler(newUrl.replace('#.XupCTbxxfDc',''))
	const soup = new JSSoup(html)
	const chapterList = soup.findAll('li', 'lng_')

	chapterList.forEach((eachSoup) => {
		const chapterName = eachSoup.find('b','val').getText()
		console.log(chapterName)
	})
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