import "./menu.css";

var navRef: HTMLElement = document.getElementById("navigation");

var menuObject = [
  {
    name: "Telefoane",
    children: [
      {
        name: "Recomandari",
        type: "accordeon",
        children: [
          {
            name: "Galaxy 5G",
            children : [
              {name : 'v1'},
              {name : 'v2'}
            ]
          },
          {
            name: "Galaxy S21"
          }
        ]
      },
      {
        name: "Telefoane",
        children: [
          {
            name: "Galaxy 2"
          }
        ]
      },
      {
        name: "Tablete"
      }
    ]
  },
  {
    name: "TV & AV"
  },
  {
    name: "Electrocasnice",
    children: [
      {
        name: "Air Dresser",
        children: [
          {
            name: "Side by Side"
          }
        ]
      }
    ]
  },
  {
    name: "IT",
    type: "accordeon",
    children: [
      {
        name: "Recomandari",
        children: [
          {
            name: "Memorie & Stocare"
          }
        ]
      },
      {
        name: "Monitoare",
        children: [
          {
            name: "Smart Monitor"
          },
          {
            name: "Monitoare UHD"
          },
          {
            name: "Monitoare Curbate"
          }
        ]
      }
    ]
  },
  {
    name: "Oferte",
    children: [
      {
        name: "Magazin Online",
        children: [
          {
            name: "Oferte Telefoane"
          },
          {
            name: "Samsung Experience Store"
          },
          {
            name: "Intrebari Frecvente Magazin"
          }
        ]
      }
    ]
  }
];

type Navigation = {
  name: string;
};

class NavigationMenu {
  menuJson: object;
  activeItem: number[];
  activeMenu: object;
  constructor(value: string) {
    this.menuJson = JSON.parse(JSON.stringify(value));
    this.activeMenu = JSON.parse(JSON.stringify(value));
    this.activeItem = [];
    this.updateMenu();
  }
  updateMenu() {
    var titleMenu: HTMLElement = document.createElement("div");
    if (this.activeItem.length === 0) {
      titleMenu.innerText = "Home";
    } else {
      var self = this;
      var titleMenuHeader: HTMLElement = document.createElement("span");
      titleMenuHeader.innerText = this.menuTitle || "";
      //add href here on click;

      var titleMenuBack: HTMLElement = document.createElement("span");
      titleMenuBack.innerText = "Back";
      titleMenuBack.className = "backMenuHeader";
      titleMenuBack.addEventListener("click", function () {
        self.activeItem.pop();
        self.updatePositionNavigation();
      });
      titleMenu.appendChild(titleMenuBack);
      titleMenu.appendChild(titleMenuHeader);
    }

    var parent = document.createElement("ul");
    this.activeMenu.forEach((element, index: number) => {
      if (typeof element.name !== "object") {
        var self = this;

        var hasChildren =
          element.hasOwnProperty("children") && element.children.length !== 0
            ? true
            : false;
        var navElement: HTMLElement = document.createElement("li");
        navElement.innerText = element.name;
        navElement.classList = hasChildren
          ? "menuHasChildren"
          : "singleElement";

        if (element.hasOwnProperty("type") && element.type === "accordeon") {
          navElement.classList.add('accordeon');
          var childrenAccordeon: HTMLElement = document.createElement("ul");
          navElement.addEventListener("click", function () {
            if (hasChildren) {
              element.children.forEach((elementAccordeon,indexAccordeon) => {
                var childrenItemAccordeon: HTMLElement = document.createElement(
                  "li"
                );
                childrenItemAccordeon.innerText = elementAccordeon.name;
                
                var accordeonHasChildren =
                elementAccordeon.hasOwnProperty("children") && elementAccordeon.children.length !== 0
                ? true
                : false;
                childrenItemAccordeon.classList = accordeonHasChildren
                ? "menuHasChildren"
                : "singleElement";
                childrenItemAccordeon.addEventListener("click", function (e) {
                  if (accordeonHasChildren) {
                    self.activeItem.push(index);
                    self.activeItem.push(indexAccordeon);
                    self.updatePositionNavigation();
                  } else {
                    //add Href
                    e.stopPropagation();
                  }
                });
                if(indexAccordeon === 0) childrenAccordeon.innerHTML = '';
                childrenAccordeon.appendChild(childrenItemAccordeon);
              });
            }
          }
          navElement.appendChild(childrenAccordeon);
        } else {
          navElement.addEventListener("click", function (e) {
            if (hasChildren) {
              self.activeItem.push(index);
              self.updatePositionNavigation();
            } else {
              //add Href
            }
          });
        }
        parent.appendChild(navElement);
      }
    });
    navRef.innerHTML = "";
    navRef.appendChild(titleMenu);
    navRef.appendChild(parent);
  }
  updatePositionNavigation() {
    if (this.activeItem.length === 0) this.updateMenu();
    let [activeObject, parentItem] = recursiveGetElement(
      this.menuJson,
      this.activeItem
    );
    this.activeMenu = activeObject;
    this.menuTitle = parentItem;
    this.updateMenu();
  }
}
function recursiveGetElement(list, activeItem, index = 0, parentItem = null) {
  if (index === activeItem.length) {
    return [list, parentItem];
  } else {
    return recursiveGetElement(
      list[activeItem[index]].children,
      activeItem,
      index + 1,
      list[activeItem[index]].name
    );
  }
}
var n: Navigation = new NavigationMenu(menuObject);
