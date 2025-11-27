import { Box, Button } from "@chakra-ui/react";
import "./index.scss";
import { registerLicense } from "@syncfusion/ej2-base";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
  SfdtExport,
  DocumentEditorComponent,
} from "@syncfusion/ej2-react-documenteditor";
import { BiSave } from "react-icons/bi";

registerLicense(
  "Mgo+DSMBaFt/QHRqVVhjVFpHaV5dX2NLfUNxT2ZcdVxwZCQ7a15RRnVfQ15jSXlWc0diXXZecQ==;Mgo+DSMBPh8sVXJ0S0J+XE9HflRBQmJWfFN0RnNedVt1fldGcC0sT3RfQF5jSH1TdkJmXH1fdXRWRw==;ORg4AjUWIQA/Gnt2VVhkQlFadVdJXnxIYVF2R2BJeFR1cV9EYEwgOX1dQl9gSX9QdkVkXHpccXFUQ2E=;MTAyOTYzOUAzMjMwMmUzNDJlMzBMbG5xZVlXb3RmckU0U2R3YTN1bTN0c21tWld3WkZkdWJ2MTBWUmN0QnpFPQ==;MTAyOTY0MEAzMjMwMmUzNDJlMzBXcld6aFpxMmdDd0N1WEtJVFdCUEk0MjhoU0ZyRXltbURERnAxTnZIemk0PQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFxKVmBWf0x0RWFab1l6cVBMYlxBNQtUQF1hSn5SdUVjXnpbcnVQTmNd;MTAyOTY0MkAzMjMwMmUzNDJlMzBuNVVJWC82OWVYeVY2dDFQMjBuelM2dTBBbWZ2WGVyTDI3a1M3dEViQ1NrPQ==;MTAyOTY0M0AzMjMwMmUzNDJlMzBERGVnTWhEeDJpZ0N3UFJScHZTK2F0QXh3TUh2Ujkva2Z4MFRxQjBLRTVVPQ==;Mgo+DSMBMAY9C3t2VVhkQlFadVdJXnxIYVF2R2BJeFR1cV9EYEwgOX1dQl9gSX9QdkVkXHpccXJRRWE=;MTAyOTY0NUAzMjMwMmUzNDJlMzBGYStXR3QxcmZva3pIY0NPT2NtbjlRdHZjZGtxTHg3L1E2NlBsRzNnZ0F3PQ==;MTAyOTY0NkAzMjMwMmUzNDJlMzBXM1dtQmhsTk1ZdDRZdnFKRkxvVjNpSXpmUE53YmpZcmozeFVYY05SVGo4PQ==;MTAyOTY0N0AzMjMwMmUzNDJlMzBuNVVJWC82OWVYeVY2dDFQMjBuelM2dTBBbWZ2WGVyTDI3a1M3dEViQ1NrPQ=="
);

DocumentEditorComponent.Inject(SfdtExport);
// DocumentEditorContainerComponent.Inject(WordExport, SfdtExport);

const Template = () => {
  let documenteditor;

  const save = () => {
    const sfdt = documenteditor.documentEditor.serialize();
  };

  return (
    <>
      <Button
        onClick={save}
        position={"fixed"}
        right={4}
        top={4}
        leftIcon={<BiSave />}
      >
        Save
      </Button>
      <Box width="calc(100vw - 620px)" h="100vh">
        <DocumentEditorContainerComponent
          ref={(scope) => {
            documenteditor = scope;
          }}
          enableSfdtExport
          height="100vh"
          enableToolbar
        >
          <Inject services={[Toolbar, SfdtExport]}></Inject>
        </DocumentEditorContainerComponent>
      </Box>
    </>
  );
};

export default Template;
