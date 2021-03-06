/* eslint-disable prettier/prettier */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import * as path from 'path';
import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
// @ts-ignore
import trayIcon from './img/ergo26.png';

declare let global: any;

const unhandled = require('electron-unhandled');
 
unhandled()

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }


  const iconPath = path.join(__dirname, 'img/ergo26.png');
  let nimage = nativeImage.createFromPath(iconPath);
  nimage = nimage.resize({ width: 16, height: 16 });
  tray = new Tray(nimage);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Play', type: 'radio' },
    { label: 'Pause', type: 'radio' },
    { label: 'Ergo Settings', type: 'radio', checked: true }
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);

  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    width: 420,
    height: 420,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true,
            webSecurity: false
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  global.mainWindow = mainWindow;

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('move', ( e:any ) => {
    console.log('electron move', e);
  });

  mainWindow.on('minimize',( e:any ) =>{
      console.log('electron minimize', e);
  });
  mainWindow.on('maximize',(e:any) =>{
      console.log('electron maximize', e);
  });
  mainWindow.on('restore',(e:any) =>{
     mainWindow?.show();
      console.log('electron restore', e);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

