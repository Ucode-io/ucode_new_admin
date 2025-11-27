import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {viewTypes} from "../../../../utils/constants/viewTypes";
import constructorViewService from "../../../../services/constructorViewService";
import style from "./style.module.scss";
import {Container, Draggable} from "react-smooth-dnd";
import {viewsActions} from "../../../../store/views/view.slice";
import {AccountTree, CalendarMonth, TableChart} from "@mui/icons-material";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import AddIcon from "@mui/icons-material/Add";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {Modal, Popover} from "@mui/material";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import MoreButtonViewType from "../../components/ViewTypeSelector/MoreButtonViewType";
import ViewTypeList from "../../components/ViewTypeList";
import OneCViewSettings from "../../components/ViewSettings/OneCViewSettings";
import ClearAllIcon from "@mui/icons-material/ClearAll";

function NewViewTabSelector({
  selectedTabIndex,
  setSelectedTabIndex,
  settingsModalVisible,
  setSettingsModalVisible,
  isChanged,
  setIsChanged,
  selectedView,
  defaultViewTab,
  setSelectedView,
  views = [],
  setTab,
}) {
  const {t} = useTranslation();
  const {tableSlug, appId} = useParams();
  const projectId = useSelector((state) => state.auth.projectId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const computedViewTypes = viewTypes?.map((el) => ({value: el, label: el}));
  const [typeNewView, setTypeNewView] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const {i18n} = useTranslation();
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setSelectedView("NEW");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openModal = (data) => {
    setIsChanged(false);
    setSettingsModalVisible(true);
    setSelectedView(data);
  };

  const closeModal = () => {
    setSettingsModalVisible(false);
    if (isChanged) queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
  };
  const deleteView = (id) => {
    constructorViewService.delete(id, tableSlug).then(() => {
      navigate("/reload", {
        state: {
          redirectUrl: window.location.pathname,
        },
      });
    });
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(views, dropResult);
    if (!result) return;
    const computedViews = result.map((el) => el.id);
    const data = {
      ids: computedViews,
      project_id: projectId,
      table_slug: tableSlug,
    };
    constructorViewService.changeViewOrder(data, tableSlug).then(() => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  return (
    <>
      <div className={style.selector} style={{minWidth: "fit-content"}}>
        <div className={style.leftSide}></div>
        <div className={style.appTabs}>
          <Container
            lockAxis="x"
            onDrop={onDrop}
            dropPlaceholder={{className: "drag-row-drop-preview"}}
            style={{display: "flex", alignItems: "center"}}
            getChildPayload={(i) => views[i]}
            orientation="horizontal">
            {views?.map((view, index) => (
              <Draggable key={view.id}>
                <div
                  onClick={() => {
                    dispatch(
                      viewsActions.setViewTab({
                        tableSlug: tableSlug,
                        tabIndex: index,
                      })
                    );

                    setSelectedTabIndex(index);
                  }}
                  className={`${style.element} ${selectedTabIndex === index ? style.active : ""}`}>
                  {view.type === "TABLE" && (
                    <TableChart className={style.icon} />
                  )}
                  {view.type === "CALENDAR" && (
                    <CalendarMonth className={style.icon} />
                  )}
                  {view.type === "CALENDAR HOUR" && (
                    <IconGenerator
                      className={style.icon}
                      icon="chart-gantt.svg"
                    />
                  )}
                  {view.type === "GANTT" && (
                    <IconGenerator
                      className={style.icon}
                      icon="chart-gantt.svg"
                    />
                  )}
                  {view.type === "TREE" && (
                    <AccountTree className={style.icon} />
                  )}
                  {view.type === "BOARD" && (
                    <IconGenerator
                      className={style.icon}
                      icon="brand_trello.svg"
                    />
                  )}
                  {view.type === "FINANCE CALENDAR" && (
                    <MonetizationOnIcon className={style.icon} />
                  )}
                  {view.type === "TIMELINE" && (
                    <ClearAllIcon className={style.icon} />
                  )}
                  <span style={{color: "#449424"}}>
                    {(view?.attributes?.[`name_${i18n.language}`]
                      ? view?.attributes?.[`name_${i18n.language}`]
                      : view.type) ?? view?.name}
                  </span>

                  {view?.attributes?.view_permission?.edit && (
                    <div className={style.popoverElement}>
                      {selectedTabIndex === index && (
                        <MoreButtonViewType
                          onEditClick={() => openModal(view)}
                          onDeleteClick={() => deleteView(view.id)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </Draggable>
            ))}
          </Container>
        </div>

        <PermissionWrapperV2 tableSlug={tableSlug} type="view_create">
          <div
            className={style.addElement}
            aria-describedby={id}
            variant="contained"
            onClick={handleClick}>
            <AddIcon className={style.icon} style={{color: "#000"}} />
          </div>
        </PermissionWrapperV2>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}>
          <ViewTypeList
            views={views}
            computedViewTypes={computedViewTypes}
            handleClose={handleClose}
            openModal={openModal}
            setSelectedView={setSelectedView}
            setTypeNewView={setTypeNewView}
          />
        </Popover>
      </div>

      <Modal
        className={style.modal}
        open={settingsModalVisible}
        onClose={closeModal}>
        <OneCViewSettings
          closeModal={closeModal}
          defaultViewTab={defaultViewTab}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          viewData={selectedView}
          typeNewView={typeNewView}
          setTab={setTab}
        />
      </Modal>
    </>
  );
}

export default NewViewTabSelector;
