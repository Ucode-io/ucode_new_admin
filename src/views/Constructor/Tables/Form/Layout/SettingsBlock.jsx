import FieldsBlock from "./FieldsBlock";
import FieldSettings from "../Fields/FieldSettings";
import RelationSettings from "../Relations/RelationSettings";

const SettingsBlock = ({
  mainForm,
  layoutForm,
  selectedSettingsTab,
  setSelectedSettingsTab,
  closeSettingsBlock,
  selectedField,
  updateSectionTab,
  selectedRelation,
  getRelationFields,
  sectionTabs,
  selectedTabIndex,
  insertSectionTab,
  removeSectionTab,
  moveSectionTab,
  appendSectionTab,
  selectedLayoutIndex,
}) => {
  if (selectedField) {
    return (
      <FieldSettings
        field={selectedField}
        mainForm={mainForm}
        closeSettingsBlock={closeSettingsBlock}
      />
    );
  }

  if (selectedRelation) {
    return (
      <RelationSettings
        closeSettingsBlock={closeSettingsBlock}
        relation={selectedRelation}
        getRelationFields={getRelationFields}
      />
    );
  }

  return (
    <FieldsBlock
      mainForm={mainForm}
      layoutForm={layoutForm}
      selectedSettingsTab={selectedSettingsTab}
      setSelectedSettingsTab={setSelectedSettingsTab}
      closeSettingsBlock={closeSettingsBlock}
      sectionTabs={sectionTabs}
      updateSectionTab={updateSectionTab}
      insertSectionTab={insertSectionTab}
      removeSectionTab={removeSectionTab}
      moveSectionTab={moveSectionTab}
      appendSectionTab={appendSectionTab}
      selectedTabIndex={selectedTabIndex}
      selectedLayoutIndex={selectedLayoutIndex}
    />
  );
};

export default SettingsBlock;
