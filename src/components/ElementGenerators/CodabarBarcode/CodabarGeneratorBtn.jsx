import React from "react";
import { useParams } from "react-router-dom";
import barcodeService from "../../../services/barcodeService";
import styles from "./styles.module.scss";

function CodabarGeneratorBtn({ onChange, field }) {
    const { tableSlug } = useParams()
    
  const generateBarcode = () => {
    barcodeService.getCodebar( tableSlug, field?.id ).then((res) => {
      onChange(res?.code);
    });
  };

  return (
    <>
      <button className={styles.barcode_generate} onClick={generateBarcode}>
        Generate
      </button>
    </>
  );
}

export default CodabarGeneratorBtn;
