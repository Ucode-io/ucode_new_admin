import { Worker, Viewer as PDFViewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./index.scss"

const Viewer = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();


  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div style={{ height: 'calc(100vh - 130px)' }} className="PDF-viewer"  >
        <PDFViewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </Worker>
  );
};

export default Viewer;
