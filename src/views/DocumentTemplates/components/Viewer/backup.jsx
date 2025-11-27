import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useEffect, useMemo, useState } from "react";
import { generateID } from "../../../../utils/generateID";
import useId from "../../../../hooks/useId";




const Viewer = ({ onDownLoad, id: idFromProps, url, setViewerId = () => {} }) => {
  // const [localId, setLocalId] = useState(generateID())
  const id = useId()
  // const id = idFromProps ?? localId

  const editorInstance = window.DocEditor?.instances?.[id];

  useEffect(() =>{
    return () => {
      editorInstance?.destroyEditor()
    }
  }, [])

  const localId = useMemo(() => {
    return generateID()
  }, [url])

  useEffect(() =>{ 
    setViewerId(id)
  }, [id])

  return < >
    <DocumentEditor
      id={id}
      documentServerUrl="http://37.27.196.85:8084/"
      config={{
        type: "embedded",
        document: {
          fileType: "docx",
          key: localId,
          title: " ",
          url: url,
        },
        documentType: "word",
        editorConfig: {
          mode: "view",
          customization: {
          }
        },
        events: {
          onDownloadAs: onDownLoad
        },
      }}
    />
  </>
}

export default Viewer