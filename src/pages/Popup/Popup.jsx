import React, { useState, useEffect } from 'react';
import remove from '../../assets/img/close.svg';
import webScraper, { updater, allUpdater } from '../../utils/webScraper'
import './Popup.css';
import { key, saveAsyncStorage, getAsyncStorage } from '../../utils/chrome'

const Popup = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [mangaObjectList, setMangaObjectList] = useState([])
  const [currTitle, setCurrTitle] = useState()
  const [currMangaObject, setCurrMangaObject] = useState([])
  const [selectedManga, setSelectedManga] = useState(false)

  useEffect(() => {
    getAsyncStorage(key.mangaList, (data) => {
      data && setMangaObjectList(data)
    })
  }, [])

  const floatBtnHandler = () => {
    if (!selectedManga) {
      setIsAdding(!isAdding)
    } else {
      setSelectedManga(false)
      setCurrMangaObject([])
      setCurrTitle()
    }
  }

  const removeHandler = (e, index) => {
    e.stopPropagation()
    const removedList = mangaObjectList
    removedList.splice(index, 1)
    setMangaObjectList([...removedList])
    saveAsyncStorage(key.mangaList, [...removedList])
  }

  const urlHandler = async () => {
    const mangaObject = await webScraper(newUrl)
    setMangaObjectList([...mangaObjectList, mangaObject])
    saveAsyncStorage(key.mangaList, [...mangaObjectList, mangaObject])
    setNewUrl('')
    console.log('save success')
  }

  const selectMangaHandler = (index) => {
    setCurrMangaObject(mangaObjectList[index])
    setSelectedManga(true)
    setIsAdding(false)
    setCurrTitle(mangaObjectList[index].title)
  }

  const selectChapterHandler = (item, index) => {
    const newSeenMangaObject = { ...currMangaObject }
    newSeenMangaObject.chapterList[index].readed = true
    let notReadedAllFlag = false
    newSeenMangaObject.chapterList.forEach(item => {
      if (!item.readed) notReadedAllFlag = true
    })
    if (!notReadedAllFlag) newSeenMangaObject.isReadedAll = true
    let replaceList = [...mangaObjectList]
    for (let i = 0; i < replaceList; i++) {
      if (currMangaObject === replaceList[i]) {
        replaceList[i] = newSeenMangaObject
        break
      }
    }
    setCurrMangaObject(newSeenMangaObject)
    setMangaObjectList(replaceList)
    saveAsyncStorage(key.mangaList, [...replaceList])
    chrome.tabs.create({ url: item.link })
  }

  const seenAllHandler = () => {
    let seenAllMangaObject = { ...currMangaObject }
    seenAllMangaObject.isReadedAll = true
    seenAllMangaObject.chapterList.forEach(item => {
      if (!item.readed) {
        item.readed = true
      }
    })
    const index = mangaObjectList.indexOf(currMangaObject)
    const replaceList = [...mangaObjectList]
    replaceList[index] = seenAllMangaObject
    
    setCurrMangaObject(seenAllMangaObject)
    setMangaObjectList(replaceList)
    saveAsyncStorage(key.mangaList, [...replaceList])
    console.log(seenAllMangaObject)
  }

  const updateHandler = () => {
    if (mangaObjectList){
      if (!selectedManga) {
        updateAll()
      } else {
        updateManga()
      }
    }
  }

  const updateAll = async () => {
    const updatedMangaList = await allUpdater([...mangaObjectList])
    // console.log(updatedMangaList)
    setMangaObjectList([...updatedMangaList])
    saveAsyncStorage(key.mangaList, [...updatedMangaList])
    console.log('new chapter found')
  }

  const updateManga = async () => {
    const updatedMangaObject = await updater({...currMangaObject})
    if (updatedMangaObject.chapterList[0] !== currMangaObject.chapterList[0]) {
      const index = mangaObjectList.indexOf(currMangaObject)
      const replaceList = mangaObjectList
      replaceList[index] = updatedMangaObject
      setMangaObjectList([...replaceList])
      setCurrMangaObject(updatedMangaObject)
      saveAsyncStorage(key.mangaList, [...replaceList])
      console.log('new chapter found')
    }
  }

  const ChapterList = () => {
    const list = currMangaObject.chapterList.map((item, index) => {
      return (
        <div key={index} className="listItem" onClick={() => selectChapterHandler(item, index)}>
          <span className="itemName">{item.title}</span>
          <span className="newChapter">{item.readed === false && 'NEW!'}</span>
        </div>
      )
    })
    return list
  }

  const MangaList = () => {
    const list = mangaObjectList.map((item, index) => {
      return (
        <div key={index} className="listItem" onClick={() => selectMangaHandler(index)}>
          <span className="itemName">{item.title}</span>
          <span className="readStatus">{!item.isReadedAll && 'NEW!'}</span>
          <img className="remove" onClick={(e) => removeHandler(e, index)} src={remove} />
          <span className="status">{`Last updated: ${item.lastUpdated}`}</span>
        </div>
      )
    })
    return list
  }

  return (
    <div className="wrapper">
      <div className="titleContainer">
        <span className="title">{currTitle || 'Manga Tracker'}</span>
        <div className="rightContainer">
          {selectedManga && <button className='readedAll' onClick={() => seenAllHandler()}>Seen all</button>}
          <button className='reload' onClick={() => updateHandler()}>{selectedManga ? 'Update' : 'Update all'}</button>
        </div>
      </div>
      <div className="bodyContainer">
        <div className="listContainer">
          {selectedManga ? <ChapterList /> : <MangaList />}
        </div>
      </div>
      <div className="inputContainer">
        <button onClick={() => floatBtnHandler()} className="urlAddButton">{selectedManga ? '<' : '+'}</button>
        {isAdding && (
          <div className="urlInputContainer">
            <input 
              onChange={(e) => setNewUrl(e.target.value)}
              value={newUrl}
              className="urlInput"
              placeholder="Place manga link here."
            />
            <button onClick={() => urlHandler()} className="urlInputSubmit">Add</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
