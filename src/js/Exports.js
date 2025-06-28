// A file for defining exports
const remote = require('@electron/remote');
const canvas = document.getElementById('broadcast-canvas');
const GetElement = (id) => document.getElementById(id);
const GetElements = (className) => document.getElementsByClassName(className);
const SetInner = (type, id, value) => {
    const element = document.getElementById(id);
    if (element) {
        switch (type) {
            case 'text':
                element.innerText = value;
                break;
            case 'html':
                element.innerHTML = value;
                break;
            default:
                console.warn(`Unknown type: ${type}`);
        }
    }
};
const SetDocumentTitle = (title) => {
    document.title = title;
};