const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 600,
        minHeight: 600,
        minWidth: 1024,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        frame: false,
        icon: require('path').join(__dirname, 'build/icons', '256x256.png'),
    });

    win.loadFile('src/index.html');
    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(win.webContents);
    try {
        require('electron-reloader')(module)
    }catch{}
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});