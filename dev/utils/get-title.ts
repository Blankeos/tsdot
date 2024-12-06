const TITLE_TEMPLATE = "%s | Dot.js";

export default function getTitle(title: string = "Home") {
  return TITLE_TEMPLATE.replace("%s", title);
}
