import { cnSwitcher } from "./utils.js";

export var ifc = {};

export var selectedVersions = {
  first: cnSwitcher('first'),
  second: cnSwitcher('second')
}

export var picParams = {
  scale: cnSwitcher('active', 1),
  mode: cnSwitcher('active', 'SBS')
}
