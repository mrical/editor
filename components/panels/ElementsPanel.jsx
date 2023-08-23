"use client";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import React, { useContext } from "react";
import Element from "../entity/Element";

const ElementsPanel = () => {
  const store = useContext(StoreContext);
  const editorElements = store.editorElements;
  return (
    <div>
      {editorElements.map((element) => (
        <Element key={element.id} element={element} />
      ))}
    </div>
  );
};

export default observer(ElementsPanel);
