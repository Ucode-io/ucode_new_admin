import { Box, Typography } from "@mui/material";
import usePaperSize from "../../../../../../../hooks/usePaperSize";
import { SidebarBody, SidebarHeader, SidebarTitle } from "../../Sidebar-old";
import useDocumentPaperSize from "../../../../../../../hooks/useDocumentPaperSize";
const flex = {
  display: "flex",
  alighItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
};
const TemplateFormats = ({ form }) => {
  const setValueSize = (format) => {
    form.setValue("size", format.title);
  };
  const formatGroups = useDocumentPaperSize();
  return (
    <Box>
      <SidebarHeader>
        <SidebarTitle>Document format</SidebarTitle>
      </SidebarHeader>

      <SidebarBody height="calc(100vh - 100px)">
        {formatGroups.paperSizes?.map((group, groupIndex) => (
          <Box key={groupIndex} color="#000">
            <Typography px={1} fontSize="16px" fontWeight="500" mb={2}>
              {group.title}
            </Typography>
            {group?.formats?.map((format, index) => {
              const active = format.title === form.getValues("size");
              return (
                <Box
                  style={flex}
                  key={index}
                  px={2}
                  py={1}
                  marginBottom={1}
                  backgroundColor={active && "#007AFF"}
                  onClick={() => {
                    setValueSize(format);
                  }}
                  cursor="pointer"
                >
                  <Typography color={active && "#fff"}>
                    {format.title}
                  </Typography>
                  <Typography color={active && "#fff"}>
                    {format.width} x {format.height}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))}
      </SidebarBody>
    </Box>
  );
};

export default TemplateFormats;
