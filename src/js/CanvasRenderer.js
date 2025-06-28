const capturer = remote.desktopCapturer;
const charCut = 20;
let selectedSource = null;
let isCapturing = false;
let lastTime = 0;
let lastFrame = 0;

let video_stream;
let renderer;
let ctx;
let intervalId;
let isStreaming;

const test_data = [
    {
      "type": "rectangle",
      "posx": 244,
      "posy": 300,
      "sizex": 200,
      "sizey": 200,
      "color": "#ffffff"
    },
    {
      "type": "text",
      "posx": 400,
      "posy": 300,
      "fontSize": 24,
      "fontFamily": "'Segoe UI'",
      "fontWeight": "bold",
      "text": "Hello World!",
      "color": "#ffffff"
    },
    {
      "type": "image",
      "posx": 600,
      "posy": 500,
      "sizex": 200,
      "sizey": 200,
      "content": "../build/icons/512x512.png"
    }
]
const Start = async (id) => {
    CloseSelector();
    isStreaming = true;
    SetDocumentTitle(`${id} • Charles`);
    var dumped_id = '';
    if (id == null || id == undefined || id == '') {
        console.error('Screen source not selected');
        return;
    }
    if (isCapturing == true) {
        dumped_id = '';
        dumped_id = id;
        video_stream.getTracks().forEach(track => track.stop());
        renderer.pause();
        clearInterval(intervalId);
    } else {
        dumped_id = id;
    }
    isCapturing = true;
    try {
        video_stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'desktop'
                }
            },
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: dumped_id,
                    minWidth: 960,
                    maxWidth: 2560,
                    minHeight: 480,
                    maxHeight: 1440,
                    frameRate: {
                        ideal: 45,
                        max: 240
                    }
                }
            }
        })
        renderer = document.createElement('video');
        renderer.srcObject = video_stream;
        renderer.muted = true;
        GetElement('play-icon').src = './icons/media/pause.svg';
        GetElement('play').title = 'Pause';
        renderer.play();
        ctx = canvas.getContext('2d');
        intervalId = setInterval(() => {
            Update();
        }, 1000 / 60);
        AddListener({
            id: 'play',
            event: 'click',
            fx: () => {
                if (isStreaming) {
                    renderer.pause();
                    isStreaming = false;
                    GetElement('play-icon').src = './icons/media/play.svg';
                    GetElement('play').title = 'Play';
                } else {
                    renderer.play();
                    isStreaming = true;
                    GetElement('play-icon').src = './icons/media/pause.svg';
                    GetElement('play').title = 'Pause';
                }
            }
        });
    } catch (e) {
        console.error('Error starting capture:', e);
        isCapturing = false;
        isStreaming = false;
        SetDocumentTitle('Charles');
        GetElement('play-icon').src = './icons/media/play.svg';
        GetElement('play').title = 'Play';
    }
}
const Update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(renderer, 0, 0, canvas.width, canvas.height);
    RenderOverlay(test_data);
}
const RenderOverlay = (data) => {
    if (!data || data.length === 0) return;
    data.forEach((element) => {
        if (element.type === "rectangle") {
            DrawRect(ctx, {
                top: element.posy,
                left: element.posx,
                width: element.sizex,
                height: element.sizey,
                fill: element.color,
                round: 15
            });
        } else if (element.type === "text") {
            ctx.font = `${element.fontWeight} ${element.fontSize}pt ${element.fontFamily}`;
            ctx.fillStyle = element.color;
            ctx.fillText(element.text, element.posx, element.posy);
        } else if (element.type === "image") {
            const img = new Image();
            img.src = element.content;
            ctx.drawImage(img, element.posx, element.posy, element.sizex, element.sizey);
        }
    });
}
const DrawRect = (CanvasCTX, {top: y, left: x, width: w, height: h, fill: f, round: r}) => {
    CanvasCTX.save();
    CanvasCTX.fillStyle = f;
    if(r && r > 0) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      CanvasCTX.beginPath();
      CanvasCTX.moveTo(x + r, y);
      CanvasCTX.arcTo(x + w, y, x + w, y + h, r);
      CanvasCTX.arcTo(x + w, y + h, x, y + h, r);
      CanvasCTX.arcTo(x, y + h, x, y, r);
      CanvasCTX.arcTo(x, y, x + w, y, r);
      CanvasCTX.closePath();
      CanvasCTX.fill();
    } else {
      CanvasCTX.fillRect(x, y, w, h);
    }
    CanvasCTX.restore();
    console.log('Drew called')
}
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