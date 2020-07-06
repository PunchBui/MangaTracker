export const key = {
  mangaList: 'mangaList'
}

export const saveAsyncStorage = (key, value) => {
  chrome.storage.local.set({ [key]: value }, () => {
    if (chrome.runtime.lastError) {
      alert(error)
    } else {
      console.log('Value is set to ', value)
    }
  });
}

export const getAsyncStorage = (key, handler) => {
  chrome.storage.local.get(key, (result) => {
    console.log('Value currently is ', result[key]);
    handler(result[key])
  });
}