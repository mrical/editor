"use client";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import React, { useContext } from "react";
import { ReactSVG } from "react-svg";

const Element = ({ element }) => {
  const store = useContext(StoreContext);
  const bgColor = "#27cd73";
  return (
    <div
      style={{
        backgroundColor: bgColor,
      }}
      className={`flex mx-2 my-1 py-2 px-1 flex-row justify-start items-center ${bgColor} max-w-[200px]`}
      key={element.id}
      onClick={() => {
        store.setSelectedElement(element);
      }}
    >
      {/* <Icon size="20" color="gray"></Icon> */}
      <div className="truncate text-xs ml-2 flex-1 font-medium">
        {element.name}
      </div>
      <div>
        {element.type === "video" ? (
          <video
            className="opacity-0 max-w-[20px] max-h-[20px]"
            src={element.properties.src}
            onLoad={() => {
              store.refreshElements();
            }}
            onLoadedData={() => {
              store.refreshElements();
            }}
            height={20}
            width={20}
            id={element.properties.elementId}
          ></video>
        ) : null}
        {element.type === "image" ? (
          <img
            className="opacity-0 max-w-[20px] max-h-[20px]"
            src={element.properties.src}
            onLoad={() => {
              store.refreshElements();
            }}
            onLoadedData={() => {
              store.refreshElements();
            }}
            height={20}
            width={20}
            id={element.properties.elementId}
          ></img>
        ) : null}
        {element.type === "audio" ? (
          <audio
            className="opacity-0 max-w-[20px] max-h-[20px]"
            src={element.properties.src}
            onLoad={() => {
              store.refreshElements();
            }}
            onLoadedData={() => {
              store.refreshElements();
            }}
            id={element.properties.elementId}
          ></audio>
        ) : null}
        {element.type === "shape" && element.properties.src.slice(-3)==="svg" ? (
          <ReactSVG
            src={element.properties.src}
            afterInjection={(svg) => {
              // console.log("svg", svg, svg.classList, svg.getAttribute("id"));

              svg.classList.add("opacity-0");
              svg.classList.add("max-w-[20px]");
              svg.classList.add("max-h-[20px]");
              svg.setAttribute("id", element.properties.elementId);
              console.log("svg", svg);
              store.refreshElements();
            }}
            fallback={(err) => {
              console.log(err);
            }}
            //className="opacity-0 max-w-[20px] max-h-[20px]"
            onLoad={() => {
              store.refreshElements();
            }}
            // id={element.properties.elementId}
          />
        ) : null}
        {element.type === "shape" && element.properties.src.slice(-3)==="png" ?( 
          <img className="opacity-0 max-w-[20px] max-h-[20px]"
          src={element.properties.src}
          onLoad={() => {
            store.refreshElements();
          }}
          onLoadedData={() => {
            store.refreshElements();
          }}
          height={20}
          width={20}
          id={element.properties.elementId}  />
         ): null}
      </div>
      <button
        className="bg-red-500 hover:bg-red-700 text-white mr-2 text-xs py-0 px-1 rounded"
        onClick={(e) => {
          store.removeEditorElement(element.id);
          store.refreshElements();
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        X
      </button>
    </div>
  );
};

export default observer(Element);
