const { BrowserWindow, app, Menu, dialog, ipcMain, shell } = require("electron");
const fs = require('fs')
const aboutwin = require("about-window");
const { default: openAboutWindow } = require("about-window");

app.whenReady().then(() => {
    //create da window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "FastMDLogo.ico",
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile('index.html')

    //menu
    let menuList = [
        {
            label: "File",
            submenu: [
                {
                    label: "Render",
                    click: function () {
                        win.webContents.send('render', 'md');
                    }
                },
                {
                    label: "Save File",
                    click: function () {
                        win.webContents.send('save', 'md');
                        ipcMain.on('save_msg', (ev, msg) => {
                            dialog.showSaveDialog({
                                title: 'Select the File Path to save',
                                buttonLabel: 'Save',
                                filters: [
                                    {
                                        name: 'Markdown File',
                                        extensions: ['md']
                                    },
                                ],
                                properties: []
                            }).then(f => {
                                fs.writeFile(f.filePath.toString(), msg, err => {
                                    if (err) console.log(err)
                                })
                            })
                        })
                    }
                },
                {
                    label: "Open",
                    click: function() {
                        dialog.showOpenDialog({
                            title: 'Select the file to open',
                            buttonLabel: 'Open',
                            filters: [
                                {
                                    name: 'Markdown File',
                                    extensions: ['md']
                                },
                            ],
                            properties: []
                        }).then(f => {
                            fs.readFile(f.filePaths.toString(), 'utf8', (err, data) => {
                                if (err) return console.log(err);
                                win.webContents.send('open', data);
                            })
                        })
                    }
                }
            ]
        },
        {
            label: "Tools",
            submenu: [
                {
                    label: "DevTools",
                    click: function () {
                        win.webContents.openDevTools();
                    }
                },
                {
                    label: "Markdown Guide",
                    click: function() {
                        shell.openExternal("https://www.markdownguide.org")
                    }
                }
            ]
        },
        {
            label: "About",
            click: function() {
                openAboutWindow({
                    icon_path: './FastMDLogo.png',
                    product_name: "FastMD",
                    description: "A markdown editor made by CDevv",
                })
            }
        }
    ]

    var menu = Menu.buildFromTemplate(menuList)
    Menu.setApplicationMenu(menu)
})