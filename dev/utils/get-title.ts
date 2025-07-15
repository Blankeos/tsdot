const TITLE_TEMPLATE = "%s | TSDot";

export default function getTitle(title: string = "Home") {
  return TITLE_TEMPLATE.replace("%s", title);
}
