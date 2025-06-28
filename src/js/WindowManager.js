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
        RefreshWindowState();
    }
});
AddGlobalListener({
    event: 'resize',
    fx: () => {
        RefreshWindowState();
    }
});
const RefreshWindowState = () => {
    const win = remote.getCurrentWindow();
    const maximizeIcon = GetElement('maximize-icon');
    if (win.isMaximized()) {
        maximizeIcon.src = './icons/window/restore.svg';
    } else {
        maximizeIcon.src = './icons/window/maximize.svg';
    }
}
remote.getCurrentWindow().on('maximize', RefreshWindowState);
remote.getCurrentWindow().on('unmaximize', RefreshWindowState);