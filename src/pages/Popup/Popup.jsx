import React, { useState } from 'react';
import reload from '../../assets/img/reload.svg';
import Greetings from '../../containers/Greetings/Greetings';
import webScraper from '../../utils/webScraper'
import './Popup.css';

const Popup = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')

  const [mangaList, setMangaList] = 'teasdasdasdasdst'

  const urlHandler = () => {
    webScraper(newUrl)
    setNewUrl('')
  }
  return (
    <div className="wrapper">
      <div className="titleContainer">
        <span className="title">Nice Oppai Tracker</span>
        <img className="reloadButton" src={reload} />
      </div>
      <div className="bodyContainer">
        <div className="listContainer">
          <div className="listItem">
            <span className="itemName">test</span>
            <span className="status">status</span>
          </div>
        </div>
      </div>
      <div className="inputContainer">
        <button onClick={() => setIsAdding(!isAdding)} className="urlAddButton">+</button>
        {isAdding && (
          <div className="urlInputContainer">
            <input onChange={(e) => setNewUrl(e.target.value)} className="urlInput" />
            <button onClick={() => urlHandler()} className="urlInputSubmit">Add</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
