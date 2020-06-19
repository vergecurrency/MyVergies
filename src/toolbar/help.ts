import { MenuItem, Menu } from 'electron'

const SubMenuItems: MenuItem[] = [
  new MenuItem({
    label: 'Learn how to create a new wallet'
  }),
  new MenuItem({
    label: 'Learn how to restore an existing wallet'
  }),
  new MenuItem({
    label: 'Learn how to send XVG'
  }),
  new MenuItem({
    label: 'Learn how to receive XVG'
  }),
  new MenuItem({
    type: 'separator'
  }),
  new MenuItem({
    label: 'Visit our GitHub',
    click: () => {
      require('electron').shell.openExternal(
        'https://github.com/vergecurrency'
      )
    }
  }),
  new MenuItem({
    label: 'Visit vergecurrency.com',
    click: () => {
      require('electron').shell.openExternal('https://vergecurrency.com')
    }
  })
]

const HelpSubMenu = new Menu()
for (const item of SubMenuItems) {
  HelpSubMenu.append(item as MenuItem)
}

const HelpMenu: MenuItem = {
  role: 'help',
  submenu: HelpSubMenu
} as MenuItem

export default HelpMenu
