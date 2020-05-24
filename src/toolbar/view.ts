import { MenuItem, Menu } from "electron";
import { isDevelopmentEnvironment } from "@/utils";

let SubMenuItems: MenuItem[] = [
  new MenuItem({
    role: "resetZoom"
  }),
  new MenuItem({
    role: "zoomIn"
  }),
  new MenuItem({
    role: "zoomOut"
  }),
  new MenuItem({
    type: "separator"
  }),
  new MenuItem({
    role: "togglefullscreen"
  })
];

if (isDevelopmentEnvironment()) {
  SubMenuItems = [
    ...SubMenuItems,
    new MenuItem({
      type: "separator"
    }),
    new MenuItem({
      label: "Toggle Developer Tools",
      accelerator:
        process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
      click(_: any, focusedWindow: any) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools();
      }
    }),
    new MenuItem({
      label: "Reload",
      accelerator: "CmdOrCtrl+R",
      click(_: any, focusedWindow: any) {
        if (focusedWindow) focusedWindow.reload();
      }
    })
  ];
}

const ViewSubMenu = new Menu();
for (const item of SubMenuItems) {
  ViewSubMenu.append(item as MenuItem);
}

const ViewMenu: MenuItem = new MenuItem({
  role: "viewMenu",
  submenu: ViewSubMenu
});

export default ViewMenu;
