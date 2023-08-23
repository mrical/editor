"use client";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import React, { useContext } from "react";
import TextResourcesPanel from "./panels/TextResourcesPanel";
import ImageResourcesPanel from "./panels/ImageResourcesPanel";
import ElementsResourcePanel from "./panels/ElementsResourcePanel";
import ExportPanel from "./panels/ExportPanel";

const Resources = () => {
  const store = useContext(StoreContext);
  const selectedMenuOption = store.selectedMenuOption;
  return (
    <>
      {selectedMenuOption === "Texts" ? <TextResourcesPanel /> : null}
      {selectedMenuOption === "Images" ? <ImageResourcesPanel /> : null}
      {selectedMenuOption === "Elements" ? <ElementsResourcePanel /> : null}
      {selectedMenuOption === "Export" ? <ExportPanel /> : null}
    </>
  );
};

export default observer(Resources);
