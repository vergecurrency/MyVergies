import { MenuItem, Menu, BrowserWindow, KeyboardEvent } from 'electron'

const SubMenuItems: MenuItem[] = [
  new MenuItem({
    label: 'Lock application',
    accelerator: 'CmdOrCtrl+L',
    click (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) {
      if (browserWindow) {
        browserWindow.webContents.send('lock-application')
      }
    }
  }),
  new MenuItem({
    type: 'separator'
  }),
  new MenuItem({
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }),
  new MenuItem({
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }),
  new MenuItem({
    type: 'separator'
  }),
  new MenuItem({
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }),
  new MenuItem({
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }),
  new MenuItem({
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }),
  new MenuItem({
    accelerator: 'CmdOrCtrl+A',
    role: 'selectAll'
  })
]

const ServicesSubMenu = new Menu()
for (const item of SubMenuItems) {
  ServicesSubMenu.append(item as MenuItem)
}

const ServicesMenu: MenuItem = new MenuItem({
  role: 'editMenu',
  submenu: ServicesSubMenu
})

export default ServicesMenu
