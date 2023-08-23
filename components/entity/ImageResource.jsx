"use client";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import React, { useContext, useRef, useState } from "react";

const ImageResource = ({ image, index }) => {
  const store = useContext(StoreContext);
  const [resolution, setResolution] = useState({ w: 0, h: 0 });
  const ref = useRef();
  console.log(image);
  return (
    <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative">
      <div className="bg-[rgba(0,0,0,.25)] text-white py-1 absolute text-base top-2 right-2">
        {resolution.w}x{resolution.h}
      </div>
      {!image.includes("png") && (
        <button
          className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 left-2"
          onClick={() => store.removeBG(index)}
        >
          Remove BG
        </button>
      )}

      <button
        className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 right-2"
        onClick={() => store.addImage(index)}
      >
        {/* <MdAdd size="25" /> */}
        ADD
      </button>
      <img
        onLoad={() => {
          setResolution({
            w: ref.current?.naturalWidth ?? 0,
            h: ref.current?.naturalHeight ?? 0,
          });
        }}
        ref={ref}
        className={`max-h-[${
          150 * (resolution.h / resolution.w ?? 1)
        }px] max-w-[160px]`}
        src={image}
        // height={200 * (resolution.h / resolution.w ?? 1)}
        // width={200}
        id={`image-${index}`}
      ></img>
    </div>
  );
};

export default observer(ImageResource);
