import { MenuItem, Menu } from "electron";

const SubMenuItems: MenuItem[] = [
  new MenuItem({
    label: "Lock wallet"
  }),
  new MenuItem({
    type: "separator"
  }),
  new MenuItem({
    label: "Send",
    click() {
      console.log("Send");
    }
  }),
  new MenuItem({
    label: "Receive",
    click() {
      console.log("Send");
    }
  })
];

const ServicesSubMenu = new Menu();
for (const item of SubMenuItems) {
  ServicesSubMenu.append(item as MenuItem);
}

const ServicesMenu: MenuItem = new MenuItem({
  role: "editMenu",
  submenu: ServicesSubMenu
});

export default ServicesMenu;
