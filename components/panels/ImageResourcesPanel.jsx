"use client";
import { StoreContext } from "@/store";
import React, { useContext } from "react";
import ImageResource from "../entity/ImageResource";
import { observer } from "mobx-react";

const ImageResourcesPanel = () => {
  const store = useContext(StoreContext);

  return (
    <div>
      <h2>Add Image</h2>
      {store.imageResources.map((src, i) => (
        <ImageResource image={src} index={i} />
      ))}
      <label htmlFor="fileInput">
        <input
          type="file"
          accept="image/*"
          name=""
          className="hidden"
          id="fileInput"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) return;
            store.addImageResource(URL.createObjectURL(file));
          }}
        />
        Upload
      </label>
    </div>
  );
};

export default observer(ImageResourcesPanel);
