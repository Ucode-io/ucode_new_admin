import {Collapse} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {mainActions} from "../../../../../store/main/main.slice";
import NewLayoutSettings from "./NewLayoutSettings";
import NewlayoutList from "./NewlayoutList";
import SettingsBlock from "./SettingsBlock";
import styles from "./style.module.scss";

const Layout = ({
  mainForm,
  getRelationFields,
  getData,
  setSelectedTabLayout = () => {},
}) => {
  const dispatch = useDispatch();
  const layoutForm = useForm({mode: "onChange"});
  const [settingsBlockVisible, setSettingsBlockVisible] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState({});
  const [selectedField, setSelectedField] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(0);
  const [selectedTab, setSelectedTab] = useState({});

  const selectedLayoutIndex = useMemo(() => {
    if (!mainForm.getValues("layouts")?.length > 0) return "notSelected";
    const selectedLayoutIndex = mainForm
      .getValues("layouts")
      .findIndex((layout) => layout?.id === selectedLayout?.id);
    if (selectedLayoutIndex === -1) return "notSelected";
    return selectedLayoutIndex;
  }, [selectedLayout, selectedTab]);

  const selectedTabIndex = useMemo(() => {
    const selectedTabIndex = mainForm
      .getValues(`layouts.${selectedLayoutIndex}.tabs`)
      ?.findIndex((tab) => tab?.id === selectedTab?.id);
    if (selectedTabIndex === -1) return "notSelected";
    return selectedTabIndex;
  }, [selectedTab, selectedLayout]);

  const openFieldsBlock = (type) => {
    setSelectedField(null);
    setSelectedRelation(null);
    setSelectedSettingsTab(type === "FIELD" ? 0 : 1);
    setSettingsBlockVisible(true);
  };

  const openFieldSettingsBlock = (field) => {
    setSelectedField(field);
    setSelectedRelation(null);
    setSettingsBlockVisible(true);
  };

  const openRelationSettingsBlock = (relation) => {
    setSelectedRelation(relation);
    setSelectedField(null);
    setSettingsBlockVisible(true);
  };

  const closeSettingsBlock = () => {
    setSettingsBlockVisible(false);
    setSelectedField(null);
    setSelectedRelation(null);
  };

  useEffect(() => {
    dispatch(mainActions.setSettingsSidebarIsOpen(false));
  }, [dispatch]);

  const {
    fields: sectionTabs,
    insert: insertSectionTab,
    update: updateSectionTab,
    remove: removeSectionTab,
    move: moveSectionTab,
    append: appendSectionTab,
    replace: replaceSectionTab,
  } = useFieldArray({
    control: mainForm.control,
    name: `layouts.${selectedLayoutIndex}.tabs`,
    keyName: "key",
  });

  useEffect(() => {
    updateSectionTab();
  }, [selectedLayoutIndex]);

  return (
    <>
      {selectedLayout.id ? (
        <NewLayoutSettings
          mainForm={mainForm}
          selectedLayout={selectedLayout}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setSelectedLayout={setSelectedLayout}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
          sectionTabs={sectionTabs}
          replaceSectionTab={replaceSectionTab}
          insertSectionTab={insertSectionTab}
          removeSectionTab={removeSectionTab}
          moveSectionTab={moveSectionTab}
          appendSectionTab={appendSectionTab}
        />
      ) : (
        <NewlayoutList
          setSelectedLayout={setSelectedLayout}
          mainForm={mainForm}
          getData={getData}
          setSelectedTabLayout={setSelectedTabLayout}
        />
      )}

      <div className={styles.page}>
        <Collapse
          in={settingsBlockVisible}
          unmountOnExit
          orientation="horizontal">
          <SettingsBlock
            updateSectionTab={updateSectionTab}
            mainForm={mainForm}
            layoutForm={layoutForm}
            closeSettingsBlock={closeSettingsBlock}
            selectedField={selectedField}
            selectedRelation={selectedRelation}
            selectedSettingsTab={selectedSettingsTab}
            setSelectedSettingsTab={setSelectedSettingsTab}
            getRelationFields={getRelationFields}
            sectionTabs={sectionTabs}
            insertSectionTab={insertSectionTab}
            removeSectionTab={removeSectionTab}
            moveSectionTab={moveSectionTab}
            appendSectionTab={appendSectionTab}
            selectedTab={selectedTab}
            selectedTabIndex={selectedTabIndex}
            selectedLayoutIndex={selectedLayoutIndex}
          />
        </Collapse>
      </div>
    </>
  );
};

export default Layout;
