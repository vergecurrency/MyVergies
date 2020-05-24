import { MenuItem, Menu } from "electron";

const SubMenuItems: MenuItem[] = [
  new MenuItem({
    role: "minimize"
  }),
  new MenuItem({
    role: "close"
  })
];

const HelpSubMenu = new Menu();
for (const item of SubMenuItems) {
  HelpSubMenu.append(item as MenuItem);
}

const HelpMenu: MenuItem = {
  role: "help",
  submenu: HelpSubMenu
} as MenuItem;

export default HelpMenu;
