import { MenuItem, Menu } from 'electron'
import { isWinOSEnvironment } from '@/utils'

let SubMenuItems: MenuItem[] = [
  new MenuItem({
    role: 'minimize'
  }),
  new MenuItem({
    role: 'close'
  })
]

if (isWinOSEnvironment()) {
  SubMenuItems = [
    ...SubMenuItems,
    new MenuItem({
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }),
    new MenuItem({
      role: 'zoom'
    }),
    new MenuItem({
      type: 'separator'
    }),
    new MenuItem({
      role: 'front'
    })
  ]
}

const WindowSubMenu = new Menu()
for (const item of SubMenuItems) {
  WindowSubMenu.append(item as MenuItem)
}

const WindowMenu: MenuItem = {
  role: 'windowMenu',
  submenu: WindowSubMenu
} as MenuItem

export default WindowMenu
