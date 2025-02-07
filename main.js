const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'deepseek-logo.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadURL('https://chat.deepseek.com/');

    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
    if (mainWindow) {
        mainWindow.show();
    } else {
        createMainWindow();
    }
});

app.on('before-quit', () => {
    app.isQuiting = true;
});
