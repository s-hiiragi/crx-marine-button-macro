//console.log('content.js started');


let playbackHistory = [];  // 記録した履歴 type: Array<{button: HTMLElement}>
let isRecording = false;  // 記録中 状態


async function sleep(millis) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, millis);
    });
}


// 指定したボタンのボイスを再生する
async function playVoice(button) {

    return new Promise((resolve, reject) => {
        const player = document.querySelector('#player');

        player.addEventListener('ended', function(){
            player.removeEventListener('ended', arguments.callee);
            resolve();
        });

        button.click();
    });
}


// ツールバーを表示する
function createMacrobar() {

    const macroControlBar = document.createElement('div');

    macroControlBar.innerHTML = `
        <input type="button" value="記録" class="record">
        <input type="button" value="再生" class="play">
    `;

    macroControlBar.style.cssText = `
        position: fixed;
        left: 10px;
        top: 10px;
    `;

    const recordButton = macroControlBar.querySelector('.record');
    const playButton = macroControlBar.querySelector('.play');

    recordButton.onclick = function() {
        isRecording = !isRecording;

        if (isRecording) {
            recordButton.style.backgroundColor = 'red';
            playbackHistory = [];
        } else {
            recordButton.style.backgroundColor = '';
        }
    };

    playButton.onclick = async function() {
        playButton.style.backgroundColor = 'blue';

        for (let i = 0; i < playbackHistory.length; i++) {
            await playVoice(playbackHistory[i].button);
            await sleep(200);
        }

        playButton.style.backgroundColor = '';
    };

    document.body.appendChild(macroControlBar);
}


// 押されたボタンを履歴に記録する (記録中のみ)
function recordPlayback() {

    document.addEventListener('click', (event) => {

        if (!isRecording) {
            return;
        }

        const classes = Array.from(event.target.classList);
        if (!classes.includes('button-label') && !classes.includes('voice-button')) {
            return;
        }

        // 先祖要素を辿ってボタンを探す
        let p = event.target;
        while (p) {
            if (Array.from(p.classList).includes('voice-button')) {
                break;
            }
            p = p.parentElement;
        }
        const button = p;

        if (button === null) {
            console.error('could not find button');
            return;
        }

        playbackHistory.push({button: button});
    });
}


createMacrobar();
recordPlayback();
