import React, { useState } from 'react';
import reload from '../../assets/img/reload.svg';
import remove from '../../assets/img/close.svg';
import Greetings from '../../containers/Greetings/Greetings';
import webScraper from '../../utils/webScraper'
import './Popup.css';

const Popup = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [mangaObjectList, setMangaObjectList] = useState([])

  const removeHandler = (e, index) => {
    e.stopPropagation()
    const removedList = mangaObjectList
    removedList.splice(index, 1)
    setMangaObjectList([...removedList])
  }

  const urlHandler = async () => {
    const mangaObject = await webScraper(newUrl)
    setMangaObjectList([...mangaObjectList, mangaObject])
    setNewUrl('')
  }

  const selectMangaHandler = () => {
    console.log('selected manga')
  }

  const MangaList = () => {
    const list = mangaObjectList.map((item, index) => {
      return (
        <div key={index} className="listItem" onClick={() => selectMangaHandler()}>
          <span className="itemName">{item.title}</span>
          <img className="remove" onClick={(e) => removeHandler(e, index)} src={remove}/>
          <span className="status">{item.lastUpdated}</span>
        </div>
      )
    })
    return list
  }
  
  return (
    <div className="wrapper">
      <div className="titleContainer">
        <span className="title">Manga Tracker</span>
        <img className="reloadButton" src={reload} />
      </div>
      <div className="bodyContainer">
        <div className="listContainer">
          <MangaList />
        </div>
      </div>
      <div className="inputContainer">
        <button onClick={() => setIsAdding(!isAdding)} className="urlAddButton">+</button>
        {isAdding && (
          <div className="urlInputContainer">
            <input onChange={(e) => setNewUrl(e.target.value)} value={newUrl} className="urlInput" />
            <button onClick={() => urlHandler()} className="urlInputSubmit">Add</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
