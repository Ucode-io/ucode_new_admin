import {useEffect, useMemo, useRef, useState} from "react";
import styles from "./month.module.scss";
import "../moveable.scss";
import {Menu} from "@mui/material";
import {dateValidFormat} from "../../../../utils/dateValidFormat";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import {getRelationFieldTableCellLabel} from "../../../../utils/getRelationFieldLabel";
import MultiselectCellColoredElement from "../../../../components/ElementGenerators/MultiselectCellColoredElement";
import CalendarStatusSelect from "../../components/CalendarStatusSelect";
import {useParams} from "react-router-dom";
import useTimeList from "../../../../hooks/useTimeList";
import constructorObjectService from "../../../../services/constructorObjectService";
import {format, setHours, setMinutes} from "date-fns";
import InfoBlockMonth from "./InfoBlockMonth";
import InfoBlock from "../InfoBlock";
import {useTranslation} from "react-i18next";

const DataMonthCard = ({
  date,
  view,
  fieldsMap,
  data,
  viewFields,
  navigateToEditPage,
}) => {
  const [info, setInfo] = useState(data);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const ref = useRef();
  const {tableSlug} = useParams();
  const {timeList} = useTimeList(view.time_interval);
  const [target, setTarget] = useState();
  const {i18n} = useTranslation();

  useEffect(() => {
    if (!ref?.current) return null;
    setTarget(ref.current);
  }, [ref]);

  const [frame] = useState({
    translate: [0, info.calendar?.startPosition ?? 0],
  });

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const infoBlockBg = useMemo(() => {
    return (
      fieldsMap[view.status_field_slug]?.attributes?.options?.find(
        (opt) => opt.value === info?.status?.[0]
      )?.color ?? "silver"
    );
    //
  }, [view.status_field_slug, fieldsMap, info.status]);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const onPositionChange = (position, height) => {
    if (!position || position.translate[1] < 0) return null;

    const beginIndex = Math.floor((position.translate[1] + 2) / 40);
    const endIndex = Math.ceil((position.translate[1] + height) / 40);

    const startTime = computeTime(beginIndex);
    const endTime = computeTime(endIndex);

    const computedData = {
      ...info,
      [view.calendar_from_slug]: startTime,
      [view.calendar_to_slug]: endTime,
      calendar: {
        ...info.calendar,
        elementFromTime: startTime,
        elementToTime: endTime,
      },
    };

    constructorObjectService
      .update(tableSlug, {
        data: computedData,
      })
      .then((res) => {
        setInfo(computedData);
      });
  };

  const computeTime = (index) => {
    const computedTime = timeList[index];

    const hour = Number(format(computedTime, "H"));
    const minute = Number(format(computedTime, "m"));

    return setMinutes(setHours(date, hour), minute);
  };
  // ---------DRAG ACTIONS------------

  const onDragStart = (e) => {
    e.set([0, frame.translate[1] > 0 ? frame.translate[1] : 0]);
  };

  const onDrag = ({target, beforeTranslate}) => {
    if (beforeTranslate[1] < 0) return null;
    target.style.transform = `translateX(${beforeTranslate[1]}px)`;
  };

  const onDragEnd = ({lastEvent}) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate;
      onPositionChange(lastEvent, lastEvent.height);
    }
  };

  // ----------RESIZE ACTIONS----------------------

  const onResizeStart = (e) => {
    e.setOrigin(["%", "%"]);
    e.dragStart && e.dragStart.set(frame.translate);
  };

  const onResize = ({target, width, drag}) => {
    const beforeTranslate = drag.beforeTranslate;
    if (beforeTranslate[1] < 0) return null;
    target.style.width = `${width}px`;
    target.style.transform = `translateX(${beforeTranslate[1]}px)`;
    // if (width <= 40) setIsSingleLine(true);
    // else setIsSingleLine(false);
  };

  const onResizeEnd = ({lastEvent}) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate;
      onPositionChange(lastEvent.drag, lastEvent.height);
    }
  };

  return (
    <>
      <div
        key={data.guid}
        className={styles.infoBlockWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          //   top: 0,
          transform: `translateX(${info.calendar?.startPosition}px)`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          openMenu(e);
        }}
        ref={ref}>
        <div
          className={styles.resizing}
          style={{
            background: infoBlockBg,
            height: "100%",
            borderRadius: "6px",
          }}>
          <div
            className={styles.infoCard}
            style={{
              height: "100%",
              background: infoBlockBg,
              overflow: "auto",
              filter: isHover
                ? "saturate(100%)"
                : "saturate(50%) brightness(125%)",
            }}>
            <InfoBlockMonth viewFields={viewFields} data={info} />
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        classes={{list: styles.menu, paper: styles.paper}}
        transformOrigin={{horizontal: "center", vertical: "top"}}
        anchorOrigin={{horizontal: "center", vertical: "bottom"}}>
        <div className={styles.popupHeader}>
          <p className={styles.time}>
            {dateValidFormat(info.calendar?.elementFromTime, "HH:mm")} -
            {dateValidFormat(info.calendar?.elementToTime, " HH:mm")}
          </p>

          <IconGenerator
            onClick={() => navigateToEditPage(info)}
            className={styles.linkIcon}
            icon="arrow-up-right-from-square.svg"
            size={16}
          />
        </div>
        {viewFields?.map((field) => (
          <div>
            <b>
              {field?.attributes?.icon ? (
                <IconGenerator
                  className={styles.linkIcon}
                  icon={field?.attributes?.icon}
                  size={16}
                />
              ) : (
                field?.label ||
                field?.attributes?.[`label_${i18n?.language}`] ||
                field?.attributes?.[`name_${i18n?.language}`]
              )}
              :{" "}
            </b>
            {field?.type === "LOOKUP" ? (
              getRelationFieldTableCellLabel(field, info, field.slug + "_data")
            ) : field?.type === "DATE_TIME" ? (
              dateValidFormat(info[field.slug], "dd.MM.yyyy HH:mm")
            ) : field?.type === "MULTISELECT" ? (
              <MultiselectCellColoredElement
                style={{padding: "2px 5px", marginBottom: 4}}
                value={info[field.slug]}
                field={field}
              />
            ) : (
              info[field?.slug]
            )}
          </div>
        ))}
        <CalendarStatusSelect
          view={view}
          fieldsMap={fieldsMap}
          info={info}
          setInfo={setInfo}
        />
      </Menu>
      {/* <Moveable
        target={target}
        className="moveable_horizantal"
        draggable
        resizable
        throttleDrag={40}
        throttleResize={40}
        keepRatio={false}
        origin={false}
        renderDirections={["w", "e"]}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      /> */}
    </>
  );
};

export default DataMonthCard;
