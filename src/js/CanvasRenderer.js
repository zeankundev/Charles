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

AddListener({
    id: 'source',
    event: 'click',
    fx: () => {
        
    }
});