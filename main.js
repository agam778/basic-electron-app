// Add all dependencies

const { app, Menu, BrowserWindow, electron, dialog } = require("electron");
const openAboutWindow = require("about-window").default;
const isMac = process.platform === "darwin";
const isOnline = require("is-online");

// Top Menu Bar

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "Application",
    submenu: [
      {
        label: "About 'Your App Name'",
        click: () =>
          openAboutWindow({
            icon_path: `${__dirname}/icon.png`,
            product_name: "Your App Name",
            copyright: "Copyright (c) 2021 Your Name",
            package_json_dir: __dirname,
            // bug_report_url: "github repository issues url (if any, then uncomment otherwise leave this line commented)",
            // bug_link_text: "Report an issue (Uncomment only if you have inserted "bug_report_url")",
            adjust_window_size: "2",
            show_close_button: "Close",
          }),
      },
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal(
            "link of Your GitHub repo/readme or any website describing about your app etc."
          );
        },
      },
      { type: "separator" },
      {
        role: "quit",
        accelerator: process.platform === "darwin" ? "Ctrl+Q" : "Ctrl+Q",
      },
    ],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "resetZoom" },
      {
        role: "zoomIn",
        accelerator: process.platform === "darwin" ? "Control+=" : "Control+=",
      },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// The Main Window

function createWindow() {
  const win = new BrowserWindow({
    width: 1181,
    height: 670,
    icon: "./icon.png",
    webPreferences: {
      nodeIntegration: true,
      devTools: false, // Remove this line if you want Developer Tools
      autoHideMenuBar: true, // Remove this line if you want to show the menu bar always, otherwise it is visible only when you press the "Alt" key
    },
  });

  win.loadURL("https://agam778.is-a.dev", {
    // uncomment below accordingly, first is for "Linux", second for "Windows", and third for "Mac"
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
  });
}

app.whenReady().then(createWindow);

// Action performed when all the windows of app are closed

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Action performed when app is launched

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Action performed when app is ready to use

app.on("ready", function () {
  // Checks if user is online or offline, and if the user is offline, will give a warning
  isOnline().then((online) => {
    if (online) {
      console.log("You are connected to the internet!");
    } else {
      // You can also customize the options below
      const options = {
        type: "warning",
        buttons: ["Ok"],
        defaultId: 2,
        title: "Warning",
        message: "You appear to be offline!",
        detail:
          "Please check your Internet Connectivity. This app cannot run without an Internet Connection!",
      };

      // Dialog shown if user is offline

      dialog.showMessageBox(null, options);
    }
  });
});
