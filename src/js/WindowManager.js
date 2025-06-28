AddListener({
    id: 'minimize',
    event: 'click',
    fx: () => {
        remote.getCurrentWindow().minimize();
    }
});
AddListener({
    id: 'maximize',
    event: 'click',
    fx: () => {
        const win = remote.getCurrentWindow();
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    }
});
AddGlobalListener({
    event: 'resize',
    fx: () => {
        const win = remote.getCurrentWindow();
        if (win.isMaximized()) {
            GetElement('maximize-icon').src = './icons/window/restore.svg';
        } else {
            GetElement('maximize-icon').src = './icons/window/maximize.svg';
        }
    }
});