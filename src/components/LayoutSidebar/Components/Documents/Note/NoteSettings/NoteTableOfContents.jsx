import { Box, List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { CiTextAlignLeft } from "react-icons/ci";
import {
  SidebarBody,
  SidebarHeader,
  SidebarTitle,
} from "../../Components/Sidebar-old";

const NoteTableOfContents = ({ form }) => {
  const [headers, setHeaders] = useState([]);

  const cutTegs = (str) => {
    return str.replace(/<\/?[^>]+(>|$)/gi, "").replace(/& nbsp;/gi, " ");
  };

  const blocks = useWatch({
    form,
    name: "json.blocks",
  });

  useEffect(() => {
    setHeaders(
      blocks?.filter(
        (block) => block.type === "header" && block.data.level === 1
      )
    );
  }, [blocks]);

  return (
    <Box>
      <SidebarHeader>
        <SidebarTitle>
          <Box display="flex" alignItems="center">
            <CiTextAlignLeft style={{ marginRight: "10px" }} />
            Table of contents
          </Box>
        </SidebarTitle>
      </SidebarHeader>

      <SidebarBody height="calc(100vh - 100px)" px={4} mt={4}>
        <List spacing={5} color="#000">
          {headers?.map((header, index) => (
            <ListItem key={header.key}>{cutTegs(header.data.text)}</ListItem>
          ))}
        </List>
      </SidebarBody>
    </Box>
  );
};

export default NoteTableOfContents;
