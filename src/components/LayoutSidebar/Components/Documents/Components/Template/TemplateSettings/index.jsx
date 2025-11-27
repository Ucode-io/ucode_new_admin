import TemplateFormats from "./TemplateFormats";
import TemplateRelations from "./TemplateRelations";
import TemplateExport from "./TemplateExport.jsx";
import NoteShare from "../../../Note/NoteSettings/NoteShare";

const TemplateSettings = ({ selectedTabIndex, form, setFieldIsLoading }) => {
  switch (selectedTabIndex) {
    case 1:
      return <TemplateFormats form={form} />;

    case 2:
      return <TemplateExport form={form} />;

    case 3:
      return <NoteShare />;

    default:
      return <TemplateRelations setFieldIsLoading={setFieldIsLoading} />;
  }
};

export default TemplateSettings;
