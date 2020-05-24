import { app } from "electron";
import { MenuItem, Menu } from "electron";

const SubMenuItems: MenuItem[] = [
  new MenuItem({
    role: "about"
  }),
  new MenuItem({
    label: "Check for Updates..."
  }),
  new MenuItem({
    type: "separator"
  }),
  new MenuItem({
    label: "Settings",
    accelerator: "CmdOrCtrl+,"
  }),
  new MenuItem({
    role: "services",
    submenu: []
  }),
  new MenuItem({
    type: "separator"
  }),
  new MenuItem({
    role: "hide"
  }),
  new MenuItem({
    role: "hideOthers"
  }),
  new MenuItem({
    role: "unhide"
  }),
  new MenuItem({
    type: "separator"
  }),
  new MenuItem({
    label: "Quit " + app.name,
    accelerator: "CmdOrCtrl+Q",
    click() {
      app.quit();
    }
  })
];

const AppSubMenu = new Menu();
for (const item of SubMenuItems) {
  AppSubMenu.append(item as MenuItem);
}

const AppMenu: MenuItem = {
  label: "MyVergies",
  submenu: AppSubMenu
} as MenuItem;

export default AppMenu;
