import React from "react";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import styles from "./style.module.scss";
import NewSectionsBlock from "./NewSectionsBlock";
import {useFieldArray} from "react-hook-form";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import {TextField} from "@mui/material";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import {Add} from "@mui/icons-material";
import ButtonsPopover from "../../../../../components/ButtonsPopover";

function DetailTabs({
  control,
  layoutForm,
  openFieldsBlock,
  openFieldSettingsBlock,
  openRelationSettingsBlock,
  selectedTab,
  handleTabSelection,
}) {
  const {
    fields: tabs,
    insert,
    remove,
  } = useFieldArray({
    control: control,
    name: "tabs",
    keyName: "key",
  });

  const addNewSummary = () => {
    insert({
      tab_name: "",
      tab_order: "",
    });
  };

  const deleteSummary = (index) => {
    remove(index);
  };

  return (
    <Tabs className={"custom-tabs"}>
      <TabList>
        {tabs?.map((item, index) => (
          <>
            <Tab
              key={item.key}
              className={`${styles.tabs_item} ${
                selectedTab === index ? "custom-selected-tab" : "custom_tab"
              }`}
              onClick={() => handleTabSelection(index)}>
              <HFTextField
                control={control}
                // style={{width: '120px', border: '0px solid #fff', boxShadow: 'none'}}
                placeholder="Tab name"
                name={`tabs[${index}].tab_name`}
                className={styles.tabInput}
              />
            </Tab>
            <ButtonsPopover
              className={styles.deleteButton}
              // onEditClick={() => openSettingsBlock(field)}
              onDeleteClick={() => deleteSummary(index, 1)}
            />
          </>
        ))}
        <RectangleIconButton className={styles.addBtn} onClick={addNewSummary}>
          <Add />
        </RectangleIconButton>
      </TabList>

      {tabs?.map((item, index) => (
        <TabPanel key={item.id} selectedTab={selectedTab} index={index}>
          <NewSectionsBlock
            mainForm={control}
            layoutForm={layoutForm}
            openFieldsBlock={openFieldsBlock}
            openFieldSettingsBlock={openFieldSettingsBlock}
            openRelationSettingsBlock={openRelationSettingsBlock}
          />
        </TabPanel>
      ))}
    </Tabs>
  );
}

export default DetailTabs;
