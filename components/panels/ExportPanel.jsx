"use client";
import { StoreContext } from "@/store";
import React, { useContext, useEffect, useState } from "react";

const ExportPanel = () => {
  const store = useContext(StoreContext);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    if (store.canvas) {
      const imageDataURL = store.canvas?.toDataURL({
        format: "png",
        quality: 0.8,
      });
      setImageUrl(imageDataURL);
    }
  }, []);
  return (
    <div className="bg-slate-800 h-full">
      <div className="text-sm px-[16px] pt-[16px] pb-[8px] font-semibold text-white">
        Export
      </div>
      <a href={imageUrl} download={"canvas_image.png"}>
        Download Image
      </a>
    </div>
  );
};

export default ExportPanel;
