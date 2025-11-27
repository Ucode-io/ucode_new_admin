import NoteShare from "./NoteShare";
import NoteTableOfContents from "./NoteTableOfContents";

const NoteSettings = ({ selectedTabIndex, form }) => {
  switch (selectedTabIndex) {
    case 0:
      return <NoteTableOfContents form={form} />;

    case 1:
      return <NoteShare />;

    default:
      return <NoteShare />;
  }
};

export default NoteSettings;
