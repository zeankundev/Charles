const capturer = remote.desktopCapturer;
const charCut = 20;
const Start = (id) => {}
const Update = () => {}

const UpdateListing = async () => {
    const sources = await capturer.getSources({ types: ['screen', 'window'] });
    const inputSources = document.getElementById('input-sources');
    inputSources.innerHTML = ''; // Clear previous sources

    sources.forEach(source => {
        const sourceButton = document.createElement('div');
        sourceButton.className = 'source-input';
        sourceButton.innerHTML = `
            <img src="${source.thumbnail.toDataURL()}" class="source-thumbnail" alt="${source.name}">
            <span class="source-name">${source.name.slice(0, charCut) + (source.name.length > charCut ? '...' : '')}</span>
        `;
        sourceButton.ondblclick = () => Start(source.id);
        inputSources.appendChild(sourceButton);
    });
}
const CloseSelector = () => {
    GetElement('modal-blackout').style.display = 'none';
    GetElement('source-selector').style.display = 'none';
}
AddListener({
    id: 'source',
    event: 'click',
    fx: () => {
        GetElement('modal-blackout').style.display = 'flex';
        UpdateListing();
        GetElement('source-selector').style.display = 'block';
    }
});
AddListener({
    id: 'close-source',
    event: 'click',
    fx: () => {
        CloseSelector();
    }
});