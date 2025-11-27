import {MenuItem} from "@mui/material";
import React from "react";
import {useParams} from "react-router-dom";

export default function MicroFrontPdf({row, handleClose = () => {}, view}) {
  const {appId, tableSlug} = useParams();

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDocumentEditPage = (event) => {
    event.stopPropagation();
    handleClose();
    const urlTemplate = view?.attributes?.pdf_url;

    const url = replaceUrlVariables(urlTemplate, row);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <MenuItem
        onClick={(event) => {
          navigateToDocumentEditPage(event);
        }}>
        PDF page
      </MenuItem>
    </>
  );
}
