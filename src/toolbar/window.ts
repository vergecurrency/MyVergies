import { MenuItem, Menu } from "electron";
import { isWinOSEnvironment } from '@/utils';

let SubMenuItems: MenuItem[] = [
  new MenuItem({
    label: "Learn how to create a new wallet"
  }),
  new MenuItem({
    label: "Learn how to restore an existing wallet"
  }),
  new MenuItem({
    label: "Learn how to send XVG"
  }),
  new MenuItem({
    label: "Learn how to receive XVG"
  }),
  new MenuItem({
    type: "separator"
  }),
  new MenuItem({
    label: "Visit our GitHub",
    click: () => {
      require("electron").shell.openExternal(
        "https://github.com/vergecurrency"
      );
    }
  }),
  new MenuItem({
    label: "Visit vergecurrency.com",
    click: () => {
      require("electron").shell.openExternal("https://vergecurrency.com");
    }
  })
];

if(isWinOSEnvironment()){
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

const WindowSubMenu = new Menu();
for (const item of SubMenuItems) {
  WindowSubMenu.append(item as MenuItem);
}

const WindowMenu: MenuItem = {
  role: "windowMenu",
  submenu: WindowSubMenu
} as MenuItem;

export default WindowMenu;
