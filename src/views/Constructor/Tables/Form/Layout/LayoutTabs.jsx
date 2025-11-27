import {Add} from "@mui/icons-material";
import {Button} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useFieldArray, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Container, Draggable} from "react-smooth-dnd";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import ButtonsPopover from "../../../../../components/ButtonsPopover";
import {applyDrag} from "../../../../../utils/applyDrag";
import RelationTable from "../../../components/RelationTable";
import NewSectionsBlock from "./NewSectionsBlock";
import styles from "./style.module.scss";

function LayoutTabs({
  mainForm,
  layoutForm,
  openFieldsBlock,
  openFieldSettingsBlock,
  openRelationSettingsBlock,
  selectedLayout,
  setSelectedLayout,
  selectedTab,
  replaceSectionTab,
  sectionTabs,
  setSelectedTab,
  removeSectionTab,
  appendSectionTab,
}) {
  const relationsMap = useWatch({
    control: mainForm.control,
    name: "relationsMap",
  });

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {fields: viewRelations, ...viewRelationsFieldArray} = useFieldArray({
    control: mainForm.control,
    name: "view_relations",
    keyName: "key",
  });

  const computedViewRelations = useMemo(() => {
    return viewRelations
      ?.map((relation) => {
        if (relation.view_relation_type === "FILE") {
          return {
            relation,
            title: "Файл",
          };
        } else {
          return relationsMap[relation.relation_id];
        }
      })
      ?.filter((el) => el);
  }, [viewRelations, relationsMap]);

  const onDrop = (dropResult) => {
    if (
      dropResult?.removedIndex === null &&
      dropResult?.addedIndex === null &&
      !!dropResult?.payload?.id
    )
      return;

    const result = applyDrag(sectionTabs, dropResult);

    if (sectionTabs.find((tab) => tab?.id === dropResult?.payload?.id)) {
      replaceSectionTab(result);
    } else {
      appendSectionTab(dropResult?.payload);
    }

    if (result) {
      if (result.length > sectionTabs?.length) {
        viewRelationsFieldArray.insert(
          dropResult?.addedIndex,
          dropResult.payload.view_relation_type === "FILE"
            ? {...dropResult.payload, relation_id: dropResult.payload?.id}
            : {relation_id: dropResult.payload?.id}
        );
      } else {
        // viewRelationsFieldArray.replace(result)
        viewRelationsFieldArray.move(
          dropResult.removedIndex,
          dropResult.addedIndex
        );
      }
    }
  };

  const allTabs = useMemo(() => {
    return [...sectionTabs];
  }, [sectionTabs]);

  useEffect(() => {
    setSelectedTab(allTabs[0] ?? {});
  }, [allTabs]);

  const selectedLayoutIndex = useMemo(() => {
    if (!mainForm.getValues("layouts")?.length > 0) return "notSelected";
    return mainForm
      .getValues("layouts")
      .findIndex((layout) => layout?.id === selectedLayout?.id);
  }, [mainForm, selectedLayout]);

  const {i18n} = useTranslation();

  return (
    <>
      <div className={"custom-tabs"} style={{width: "100%"}}>
        <div
          style={{
            display: "flex",
          }}>
          <Container
            groupName="table_relation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 16px",
            }}
            dropPlaceholder={{className: "drag-row-drop-preview"}}
            orientation="horizontal"
            onDrop={onDrop}
            getChildPayload={(i) => allTabs[i]}>
            {allTabs?.map((tab, index) => (
              <Draggable
                key={tab.id}
                onClick={() => {
                  setSelectedTabIndex(index);
                  setSelectedTab(tab);
                }}
                // onDrag={() => handleTabsDrag(index)}
              >
                <Button
                  onClick={() => {
                    setSelectedTabIndex(index);
                    setSelectedTab(tab);
                  }}
                  style={{padding: 0}}>
                  <div
                    // className={`${styles.tabs_item} ${selectedTab === index ? "custom-selected-tab" : "custom_tab"}`}
                    className={`${styles.tabsItem} ${
                      selectedTab?.id === tab?.id ? styles.active : ""
                    }`}>
                    <div
                      className={styles.tab}
                      style={{display: "flex", alignItems: "center"}}>
                      {tab?.type === "relation"
                        ? tab?.relation?.attributes?.[
                            `label_to_${i18n?.language}`
                          ]
                        : mainForm.watch(
                            `layouts.${selectedLayoutIndex}.tabs.${index}.attributes.label_to_${i18n.language}`
                          ) ||
                          mainForm.watch(
                            `layouts.${selectedLayoutIndex}.tabs.${index}.relation.attributes.title_${i18n.language}`
                          ) ||
                          mainForm.watch(
                            `layouts.${selectedLayoutIndex}.tabs.${index}.label`
                          ) ||
                          // mainForm.watch(
                          //   `layouts.${selectedLayoutIndex}.tabs.${index}.label`
                          // ) ??
                          tab?.relation?.attributes?.[
                            `label_to_${i18n?.language}`
                          ] ||
                          tab?.attributes?.[`label_to_${i18n?.language}`] ||
                          tab?.label}
                      {tab?.type === "section" ? (
                        <ButtonsPopover
                          onEditClick={() => openFieldsBlock("RELATION")}
                          onDeleteClick={() => removeSectionTab(index, tab)}
                        />
                      ) : (
                        <ButtonsPopover
                          onEditClick={() =>
                            openRelationSettingsBlock(tab.relation ?? tab)
                          }
                          onDeleteClick={() => removeSectionTab(index, tab)}
                        />
                      )}
                    </div>
                  </div>
                </Button>
              </Draggable>
            ))}
          </Container>
          <RectangleIconButton onClick={() => openFieldsBlock("RELATION")}>
            <Add />
          </RectangleIconButton>
        </div>

        {allTabs.map((tab, index) => {
          if (tab.id === selectedTab?.id) {
            return tab?.type === "section" ? (
              <div className={styles.sections_wrapper}>
                <NewSectionsBlock
                  index={index}
                  mainForm={mainForm}
                  layoutForm={layoutForm}
                  openFieldsBlock={openFieldsBlock}
                  openFieldSettingsBlock={openFieldSettingsBlock}
                  openRelationSettingsBlock={openRelationSettingsBlock}
                  selectedLayout={selectedLayout}
                  setSelectedLayout={setSelectedLayout}
                  selectedTab={selectedTab}
                  sectionTabs={sectionTabs}
                  allTabs={allTabs}
                />
              </div>
            ) : (
              <RelationTable
                relation={computedViewRelations[selectedTabIndex]}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </>
  );
}

export default LayoutTabs;
