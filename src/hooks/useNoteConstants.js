import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@moxrbe/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import Paragraph from "@editorjs/paragraph";
import FontSize from "editorjs-inline-font-size-tool";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
import NestedList from "@editorjs/nested-list";
import FootnotesTune from "@editorjs/footnotes";
import OpenseaTool from "@editorjs/opensea";
import Underline from "@editorjs/underline";
import Telegram from "editorjs-telegram";
import Iframe from "@hammaadhrasheedh/editorjs-iframe";
import Alert from "editorjs-alerticons";
import noteFileService from "../services/noteFileService";
import BreakLine from "@moxrbe/editorjs-break-line";
import TextVariantTune from "@moxrbe/text-variant-tune";
import FontFamily from "editorjs-inline-font-family-tool";

const tools = {
  embed: Embed,
  alert: Alert,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  breakLine: {
    class: BreakLine,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+ENTER",
  },

  code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    config: {
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData();
          formData.append("file", file);

          return await noteFileService.upload(formData).then((res) => {
            return {
              success: 1,
              file: {
                url:
                  import.meta.env.VITE_CDN_BASE_URL + "ucode/" + res.filename,
              },
            };
          });
        },
      },
    },
  },
  raw: Raw,
  header: {
    class: Header,
    inlineToolbar: true,
    tunes: ["textVariant"],
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ["textVariant", "footnotes"],
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: false,
    },
  },
  marker: Marker,
  checklist: CheckList,
  NestedList: NestedList,
  inlineCode: InlineCode,
  fontFamily: FontFamily,
  simpleImage: SimpleImage,
  fontSize: FontSize,
  Color: {
    class: ColorPlugin,
    config: {
      colorCollections: [
        "#EC7878",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#0070FF",
        "#03A9F4",
        "#00BCD4",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFF",
      ],
      defaultColor: "#FF1300",
      type: "text",
      customPicker: true,
    },
  },
  Marker: {
    class: ColorPlugin,
    config: {
      defaultColor: "#FFBF00",
      type: "marker",
      icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
    },
  },
  anyTuneName: {
    class: AlignmentTuneTool,
    config: {
      default: "left",
      blocks: {
        header: "center",
        list: "left",
      },
    },
  },

  footnotes: {
    class: FootnotesTune,
  },
  textVariant: TextVariantTune,
  opensea: {
    class: OpenseaTool,
  },
  // personality: {
  //   class: Personality,
  //   // config: {
  //   //   endpoint: 'http://localhost:8008/uploadFile'
  //   // }
  // },
  underline: Underline,
};

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  breakLine: {
    class: BreakLine,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+ENTER",
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  // ToggleBlock: ToggleBlock,
  // warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    config: {
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData();
          formData.append("file", file);

          return await noteFileService.upload(formData).then((res) => {
            return {
              success: 1,
              file: {
                url:
                  import.meta.env.VITE_CDN_BASE_URL + "ucode/" + res.filename,
              },
            };
          });
        },
      },
    },
  },
  raw: Raw,
  header: {
    class: Header,
    inlineToolbar: true,
    tunes: ["textVariant"],
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ["textVariant", "footnotes"],
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: false,
    },
  },
  marker: Marker,
  checklist: CheckList,
  NestedList: NestedList,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  fontSize: FontSize,
  Color: {
    class: ColorPlugin,
    config: {
      colorCollections: [
        "#EC7878",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#0070FF",
        "#03A9F4",
        "#00BCD4",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFF",
      ],
      defaultColor: "#FF1300",
      type: "text",
      customPicker: true,
    },
  },
  Marker: {
    class: ColorPlugin,
    config: {
      defaultColor: "#FFBF00",
      type: "marker",
      icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
    },
  },
  fontFamily: FontFamily,
  anyTuneName: {
    class: AlignmentTuneTool,
    config: {
      default: "left",
      blocks: {
        header: "center",
        list: "left",
      },
    },
  },
  footnotes: {
    class: FootnotesTune,
  },
  textVariant: TextVariantTune,

  opensea: {
    class: OpenseaTool,
  },
  // personality: {
  //   class: Personality,
  //   // config: {
  //   //   endpoint: 'http://localhost:8008/uploadFile'
  //   // }
  // },
  underline: Underline,
  telegram: Telegram,
  iframe: Iframe,
  alert: {
    class: Alert,
    defaultValue: "awdkmawlkdmawlkdmawlk",
  },
  // columns: {
  //   class: editorjsColumns,
  //   config: {
  //     tools,
  //   },
  // },
};
