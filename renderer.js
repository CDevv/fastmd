const electron = require('electron')
const codemirror = require('codemirror')
const showdown = require('showdown')
const md = require('codemirror/mode/markdown/markdown.js')

var code = codemirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    lineWrapping: true,
    mode: 'markdown', 
    theme: 'material-darker',
})
code.setSize(400, 542)

var converter = new showdown.Converter();

code.on("change", () => {
    var res = converter.makeHtml(code.getValue());
    document.getElementById('result').innerHTML = res;
})

//communication
electron.ipcRenderer.on('render', (ev, msg) => {
    console.log(code.getValue())

    var res = converter.makeHtml(code.getValue());
    document.getElementById('result').innerHTML = res;
})

electron.ipcRenderer.on('save', (ev, msg) => {
    electron.ipcRenderer.send('save_msg', code.getValue())
})

electron.ipcRenderer.on('open', (ev, msg) => {
    code.setValue(msg);

    var res = converter.makeHtml(code.getValue());
    document.getElementById('result').innerHTML = res;
})