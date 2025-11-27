import { useCallback, useRef } from "react";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../../../../../../hooks/useNoteConstants.js";

const Editor = ({ value, onChange, isLoading, loadingFromTokenDoc }) => {
  const ReactEditorJS = createReactEditorJS();

  const editorCore = useRef(null);

  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleReady = () => {
    const editor = editorCore.current._editorJS;
    new DragDrop({ editor });
    new Undo({ editor });
  };

  const changeHandler = async () => {
    const outputData = await editorCore.current.save();
    // const data = JSON.stringify(outputData);
    onChange(outputData);
  };

  return (
    !isLoading &&
    !loadingFromTokenDoc && (
      <ReactEditorJS
        defaultValue={value}
        hideToolbar={true}
        onInitialize={handleInitialize}
        autofocus={true}
        onReady={handleReady}
        tools={EDITOR_JS_TOOLS}
        // holder="editorjs"
        onChange={changeHandler}
      />
    )
  );
};

export default Editor;
