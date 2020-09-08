import { app, MenuItem, Menu, BrowserWindow, KeyboardEvent } from 'electron'

const SubMenuItems: MenuItem[] = [
  new MenuItem({
    role: 'about'
  }),
  new MenuItem({
    type: 'separator'
  }),
  new MenuItem({
    label: 'Settings',
    accelerator: 'CmdOrCtrl+,',
    click (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) {
      if (browserWindow) {
        browserWindow.webContents.send('open-settings')
      }
    }
  }),
  new MenuItem({
    role: 'services',
    submenu: []
  }),
  new MenuItem({
    type: 'separator'
  }),
  new MenuItem({
    role: 'hide'
  }),
  new MenuItem({
    role: 'hideOthers'
  }),
  new MenuItem({
    role: 'unhide'
  }),
  new MenuItem({
    type: 'separator'
  }),
  new MenuItem({
    label: 'Quit ' + app.name,
    accelerator: 'CmdOrCtrl+Q',
    role: 'quit'
  })
]

const AppSubMenu = new Menu()
for (const item of SubMenuItems) {
  AppSubMenu.append(item as MenuItem)
}

const AppMenu: MenuItem = {
  label: 'MyVergies',
  role: 'appMenu',
  submenu: AppSubMenu
} as MenuItem

export default AppMenu
