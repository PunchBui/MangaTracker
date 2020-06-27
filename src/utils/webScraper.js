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
			htmlData = await response.text()
			break
		// status "Not Found"
		case 404:
			console.log('Not Found')
			break
	}
	return htmlData
}

const niceoppaiHandler = async (url) => {
	console.log('niceoppaiHandler runing')
	let cleanUrl = url.replace(/(\#\..+)/g, '').replace(/(chapter-list\/.\/)/g, '')
	const mangaObject = {
		title: '',
		chapterList: [],
		lastUpdated: new Date(),
	}
	for (let index = 1; ; index++) {
		console.log(`running ${index} page`)
		const currentUrl = `${cleanUrl}chapter-list/${index}`
		const html = await getHtmlHandler(currentUrl)
		const soup = new JSSoup(html)
		if (!mangaObject.chapterList?.length) {
			mangaObject.title = soup.find('h1', 'ttl').text
		}
		const chapterList = soup.findAll('li', 'lng_')
		if (!chapterList?.length) break
		chapterList.forEach((eachChapter, i) => {
			chapterList[i] = eachChapter.find('a', 'lst')
			chapterList[i] = {
				title: chapterList[i].attrs.href,
				link: chapterList[i].attrs.title,
			}
		})
		mangaObject.chapterList.push(...chapterList)
	}
	return(mangaObject)
}

const webScraper = async (newUrl) => {
	switch (newUrl) {
		case newUrl.match(/niceoppai/g):
			break
		default:
			const mangaObject = await niceoppaiHandler(newUrl)
			return(mangaObject)
	}
}

export default webScraper