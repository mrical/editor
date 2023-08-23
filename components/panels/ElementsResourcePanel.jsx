import { StoreContext } from "@/store";
import getImagePaths from "@/utils";
import React, { useContext, useState } from "react";
const elementTypes = [
  {
    value: "icons",
    name: "Icons",
  },
  {
    value: "logo",
    name: "Logo",
  },
  {
    value: "cta",
    name: "Cta",
  },
  {
    value: "badges",
    name: "Badges",
  },
  {
    value: "bubbles",
    name: "Bubbles",
  },
  { value: "celebrations", name: "Celebrations" },
  {
    value: "character",
    name: "Character",
  },
  { value: "doodles", name: "Doodles" },
  { value: "emoji", name: "Emoji" },
  { value: "illustration", name: "Illustration" },
  { value: "overlays", name: "Overlays" },
  { value: "promotion", name: "Promotion" },
  { value: "shapes", name: "Shapes" },
  { value: "social", name: "Social" },
  { value: "stickers", name: "Stickers" },
];
const allImages = (value) => {
  console.log(value);

  switch (value) {
    case "icons":
      return require.context(`../../public/elements/icons`, true);
      break;
    case "logo":
      return require.context(`../../public/elements/logo`, true);
      break;
    case "cta":
      return require.context(`../../public/elements/cta`, true);
      break;
    case "badges":
      return require.context(`../../public/elements/badges`, true);
      break;
    case "bubbles":
      return require.context(`../../public/elements/bubbles`, true);
      break;
    case "celebrations":
      return require.context(`../../public/elements/celebrations`, true);
      break;
    case "character":
      return require.context(`../../public/elements/character`, true);
      break;
    case "doodles":
      return require.context(`../../public/elements/doodles`, true);
      break;
    case "emoji":
      return require.context(`../../public/elements/emoji`, true);
      break;
    case "illustration":
      return require.context(`../../public/elements/illustration`, true);
      break;
    case "overlays":
      return require.context(`../../public/elements/overlays`, true);
      break;
    case "promotion":
      return require.context(`../../public/elements/promotion`, true);
      break;
    case "shapes":
      return require.context(`../../public/elements/shapes`, true);
      break;
    case "social":
      return require.context(`../../public/elements/social`, true);
      break;
    case "stickers":
      return require.context(`../../public/elements/stickers`, true);
      break;
    default:
      return require.context(`../../public/elements/icons`, true);
      break;
  }
};
const badgeImages = require.context("../../public/elements/badges", true);
const ElementsResourcePanel = () => {
  const imagePaths = allImages("icons");
  const imageList = imagePaths.keys().map((image) => imagePaths(image));
  const [images, setImages] = useState(imageList);
  const store = useContext(StoreContext);
  return (
    <div>
      <select
        defaultValue="icons"
        onChange={(e) => {
          // const imagePaths = getImagePaths(directory);
          const imagePaths = allImages(e.target.value);
          const imageList = imagePaths.keys().map((image) => imagePaths(image));
          console.log(imageList);
          setImages(imageList);
          // console.log("directory", directory, imagePaths);
        }}
        name="elType"
        id="el-type"
      >
        <option value="icons">Icons</option>
        <option value="logo">Logo</option>
        <option value="cta">Cta</option>
        <option value="badges">Badges</option>
        <option value="bubbles">Bubbles</option>
        <option value="celebrations">Celebrations</option>
        <option value="character">Character</option>
        <option value="doodles">Doodles</option>
        <option value="emoji">Emoji</option>
        <option value="illustration">Illustration</option>
        <option value="overlays">Overlays</option>
        <option value="promotion">Promotion</option>
        <option value="shapes">Shapes</option>
        <option value="social">Social</option>
        <option value="stickers">Stickers</option>
      </select>
      <div>
        {images.map((image, index) => (
          <img
            onClick={() => store.addShape(image.default.src, index)}
            key={index}
            id={`shape-image-${index}`}
            src={image.default.src}
            alt={`image-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ElementsResourcePanel;
