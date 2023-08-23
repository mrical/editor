"use client";
import React, { useState } from "react";
// import { Rembg } from "rembg-node";
import sharp from "sharp";

const index = () => {
  const [file, setFile] = useState(null);
  const [bgRemovedFile, setBgRemovedFile] = useState(null);
  const imageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(URL.createObjectURL(file));
  };
  
  const removeBackgroundClicked = async () => {
    const input = sharp(file);

    setBgRemovedFile(output);
  };
  return (
    <div>
      <h1>Upload Photo</h1>
      <label
        htmlFor="user-image"
        className="bg-slate-400 border hover:bg-slate-600"
      >
        Upload
        <input
          className="hidden"
          type="file"
          name="user-image"
          id="user-image"
          onChange={(e) => {
            imageUpload(e);
          }}
        />
      </label>
      <button onClick={removeBackgroundClicked}>Remove Background</button>
      {file && <img src={file} alt="uploaded image" />}
      {bgRemovedFile && <img src={bgRemovedFile} alt="Bg removed image" />}
    </div>
  );
};
export default index;
