import {MenuItem} from "@mui/material";
import React from "react";
import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";

export default function PdfMenuList({row, handleClose}) {
  const {appId, tableSlug} = useParams();
  const loginTableSlug = useSelector((state) => state.auth.loginTableSlug);
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  const navigateToDocumentEditPage = (template, e) => {
    const state = {
      toDocsTab: true,
      template: template,
      objectId: row?.guid,
      isTableView: true,
    };

    handleClose(e);
    navigate(`/main/${appId}/object/${tableSlug}`, {state});
  };

  const {
    data: {templates, templateFields} = {templates: [], templateFields: []},
  } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      const data = {
        table_slug: tableSlug,
      };

      data[`${loginTableSlug}_ids`] = [userId];

      return constructorObjectService.getListV2("template", {
        data,
      });
    },
    {
      select: ({data}) => {
        const templates = data?.response ?? [];
        const templateFields = data?.fields ?? [];

        return {
          templates,
          templateFields,
        };
      },
    }
  );

  return templates?.map((template, index) => (
    <MenuItem
      onClick={(e) => navigateToDocumentEditPage(template, e)}
      key={template.id}>
      {template.title}
    </MenuItem>
  ));
}
