const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  setLocalStorage: (key, value) => {
    localStorage.setItem(key, value);
  },
  getLocalStorage: (key) => {
    return localStorage.getItem(key);
  },
  setCookie: (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  },
  getCookie: (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
});

window.addEventListener('beforeunload', () => {
    const state = {
        url: window.location.href,
        scrollPosition: window.scrollY,
    };
    localStorage.setItem('appState', JSON.stringify(state));
});

window.addEventListener('load', () => {
    localStorage.clear();
    const savedState = JSON.parse(localStorage.getItem('appState'));
    if (savedState) {
        window.location.href = savedState.url;
        window.scrollTo(0, savedState.scrollPosition);
    }
});
