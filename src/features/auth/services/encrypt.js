export const encodeBase64 = (text) => {
  if (typeof text !== "string") return "";
  return btoa(unescape(encodeURIComponent(text)));
};

export const decodeBase64 = (encoded) => {
  if (typeof encoded !== "string") return "";
  return decodeURIComponent(escape(atob(encoded)));
};