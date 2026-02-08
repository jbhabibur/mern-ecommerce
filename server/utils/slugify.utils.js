export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 1. Non-word characters (symbols) muche felbe
    .replace(/[\s_-]+/g, "-") // 2. Space, underscore ba eka-dhik dash ke single dash korbe
    .replace(/^-+|-+$/g, ""); // 3. Shuru ba shesh-er dash muche felbe
};
