import Editor from "@/components/Editor";
import { StoreProvider } from "@/store";
import React from "react";

const EditorPage = () => {
  return (
    <StoreProvider>
      <Editor></Editor>
    </StoreProvider>
  );
};
EditorPage.diplsayName = "EditorPage";
export default EditorPage;
