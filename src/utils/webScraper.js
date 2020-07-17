import JSSoup from 'jssoup'
import moment from 'moment'

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
    lastUpdated: moment().format('MMMM DD YYYY, hh:mm a'),
    source: cleanUrl,
    isReadedAll: false,
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
      const link = eachChapter.find('a', 'lst')
      const title = chapterList[i].find('b', 'val').text
      chapterList[i] = {
        title: title,
        link: link.attrs.href,
        readed: false,
      }
    })
    mangaObject.chapterList.push(...chapterList)
  }
  return (mangaObject)
}

const niceoppaiUpdateHandler = async (mangaObject) => {
  console.log('niceoppaiUpdateHandler runing')
  mangaObject.lastUpdated = moment().format('MMMM DD YYYY, hh:mm a')
  let allNewChapterList = []
  getAllPage:
  for (let index = 1; ; index++) {
    console.log(`running ${index} page`)
    const currentUrl = `${mangaObject.source}chapter-list/${index}`
    const html = await getHtmlHandler(currentUrl)
    const soup = new JSSoup(html)
    const chapterList = soup.findAll('li', 'lng_')
    let newChapterList = []
    if (!chapterList?.length) break
    for (let i = 0; i < chapterList.length; i++) {
      const link = chapterList[i].find('a', 'lst').attrs.href
      const title = chapterList[i].find('b', 'val').text
      if (title === mangaObject.chapterList[0].title && link === mangaObject.chapterList[0].link) {
        allNewChapterList.push(...newChapterList)
        break getAllPage
      }
      mangaObject.isReadedAll = false
      newChapterList.push({
        title: title,
        link: link,
        readed: false,
      })
    }
    allNewChapterList.push(...newChapterList)
  }
  mangaObject.chapterList.unshift(...allNewChapterList)
  return ({...mangaObject})
}

export const updater = async (mangaObject) => {
  const { source } = mangaObject
  switch (source) {
    case source.match(/niceoppai/g):
      break
    default:
      const updatedMangaObject = await niceoppaiUpdateHandler(mangaObject)
      return (updatedMangaObject)
  }
}

export const allUpdater = async (mangaObjectList) => {
  let replaceList = []
  for await (const item of mangaObjectList) {
    const updatedItem = await updater({...item})
    console.log(updatedItem)
    replaceList.push(updatedItem)
  }
  console.log(replaceList)
  return (replaceList)
}

const webScraper = async (newUrl) => {
  switch (newUrl) {
    case newUrl.match(/niceoppai/g):
      break
    default:
      const mangaObject = await niceoppaiHandler(newUrl)
      return (mangaObject)
  }
}

export default webScraper