import { MdPictureAsPdf } from "react-icons/md";
import { useParams } from "react-router-dom";
import { VscSymbolVariable } from "react-icons/vsc";
import {
  usePdfGenerator,
  useSetVariable,
} from "../../../../../../../services/htmlExportService";
import { SidebarBody, SidebarHeader, SidebarTitle } from "../../Sidebar-old";
import { Box, Button } from "@mui/material";

const TemplateExport = ({ form }) => {
  const { projectId } = useParams();

  const { mutate: generate, isLoading: generateLoading } = usePdfGenerator({
    onSuccess: (res) => {
      window.open(res.link, { target: "_blank" });
    },
  });

  const { mutate: setVariable, isLoading: setVariableLoading } = useSetVariable(
    {
      onSuccess: (res) => {
        form.reset(res?.data);
      },
    }
  );

  const generatePdf = () => {
    generate({
      data: form.watch(),
      html: form.watch("html"),
      projectId,
    });
  };

  const setVars = () => {
    setVariable({
      data: form.watch(),
      html: form.watch("html"),
      projectId,
    });
  };

  return (
    <Box color="#000">
      <SidebarHeader>
        <SidebarTitle>Export document</SidebarTitle>
      </SidebarHeader>

      <SidebarBody height="calc(100vh - 100px)">
        <Box px={4} mt={4} display="flex" flexDirection="column" gap="10px">
          <Button
            fullWidth
            isLoading={setVariableLoading}
            leftIcon={<VscSymbolVariable />}
            variant="contained"
            onClick={setVars}
          >
            Set Variable
          </Button>

          <Button
            fullWidth
            isLoading={generateLoading}
            leftIcon={<MdPictureAsPdf />}
            variant="contained"
            onClick={generatePdf}
          >
            Export to PDF
          </Button>
        </Box>
      </SidebarBody>
    </Box>
  );
};

export default TemplateExport;
