export function getUid() {
  return Math.random().toString(36).substring(2, 9);
}
export default function getImagePaths(directory) {
  let images = [];
  directory.keys().map((item, index) => images.push(item.replace("./", "")));
  
  return images;
}