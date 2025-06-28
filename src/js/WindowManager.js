AddListener({
    id: 'minimize',
    event: 'click',
    fx: () => {
        remote.getCurrentWindow().minimize();
    }
});