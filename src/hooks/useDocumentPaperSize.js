import { useCallback } from "react";

const paperSizes = [
  {
    title: "Paper",
    formats: [
      {
        title: "A4",
        width: 595,
        height: 842,
      },
      {
        title: "A5",
        width: 420,
        height: 595,
      },
      {
        title: "A6",
        width: 298,
        height: 420,
      },
      {
        title: "Letter",
        width: 595,
        height: 842,
      },
    ],
  },
  {
    title: "Cheque (width)",
    formats: [
      {
        title: "1",
        width: 37,
        height: 1000,
      },
      {
        title: "2",
        width: 40,
        height: 1000,
      },
      {
        title: "3",
        width: 44,
        height: 1000,
      },
      {
        title: "4",
        width: 69,
        height: 1000,
      },
    ],
  },
];

const useDocumentPaperSize = (selectedIndex) => {
  const selectPaperIndexBySize = useCallback((paperSize = []) => {
    const index = paperSizes.map((item) =>
      item.formats.findIndex(
        (paper) =>
          paper.width === Number(paperSize[0]) &&
          paper.height === Number(paperSize[1])
      )
    );
    return index === -1 ? 0 : index;
  }, []);

  const selectPaperIndexByName = useCallback((title) => {
    const index = paperSizes.map((item) =>
      item.formats.findIndex((paper) => paper.title === title)
    );
    return index === -1 ? 0 : index;
  }, []);

  return {
    paperSizes,
    selectedPaperSize:
      paperSizes
        .map((item) => item.formats.find((a) => a.title === selectedIndex))
        .find((item) => item !== undefined) ?? {},
    selectPaperIndexBySize,
    selectPaperIndexByName,
  };
};

export default useDocumentPaperSize;
