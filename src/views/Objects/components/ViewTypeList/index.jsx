import React, { useMemo, useState } from "react";
import style from "./style.module.scss";
import { AccountTree, CalendarMonth, TableChart } from "@mui/icons-material";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Button } from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import constructorViewService from "../../../../services/constructorViewService";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";

export default function ViewTypeList({ computedViewTypes, views, handleClose, openModal, setSelectedView, setTypeNewView }) {
  const [selectedViewTab, setSelectedViewTab] = useState("TABLE");
  const [btnLoader, setBtnLoader] = useState(false);
  const { i18n } = useTranslation();
  const { tableSlug, appId } = useParams();
  const queryClient = useQueryClient();
  const detectImageView = useMemo(() => {
    switch (selectedViewTab) {
      case "TABLE":
        return "/img/tableView.svg";
      case "CALENDAR":
        return "/img/calendarView.svg";
      case "CALENDAR HOUR":
        return "/img/calendarHourView.svg";
      case "GANTT":
        return "/img/ganttView.svg";
      case "TREE":
        return "/img/treeView.svg";
      case "BOARD":
        return "/img/boardView.svg";
      case "FINANCE CALENDAR":
        return "/img/financeCalendarView.svg";
      case "TIMELINE":
        return "/img/calendarHourView.svg";
      default:
        return "/img/tableView.svg";
    }
  }, [selectedViewTab]);

  const detectDescriptionView = useMemo(() => {
    switch (selectedViewTab) {
      case "TABLE":
        return "Easily manage, update, and organize your tasks with Table view. ";
      case "CALENDAR":
        return "Calendar view is your place for planning, scheduling, and resource management.  ";
      case "CALENDAR HOUR":
        return "Plan out your work over time. See overlaps, map your schedule out and see it all divided by groups. ";
      case "GANTT":
        return "Plan time, manage resources, visualize dependencies and more with Gantt view";
      case "TREE":
        return "Use List view to organize your tasks in anyway imaginable – sort, filter, group, and customize columns. ";
      case "BOARD":
        return "Build your perfect Board and easily drag-and-drop tasks between columns. ";
      case "FINANCE CALENDAR":
        return "See your teams capacity, who is over or under and reassign tasks accordingly.";
      case "TIMELINE":
        return "Plan out your work over time. See overlaps, map your schedule out and see it all divided by groups.";
      default:
        return "Easily manage, update, and organize your tasks with Table view.";
    }
  }, [selectedViewTab]);

  const newViewJSON = useMemo(() => {
    return {
      type: selectedViewTab,
      users: [],
      name: "",
      default_limit: "",
      main_field: "",
      time_interval: 60,
      status_field_slug: "",
      disable_dates: {
        day_slug: "",
        table_slug: "",
        time_from_slug: "",
        time_to_slug: "",
      },
      columns: [],
      group_fields: [],
      navigate: {
        params: [],
        url: "",
        headers: [],
        cookies: [],
      },
      table_slug: tableSlug,
      updated_fields: [],
      multiple_insert: false,
      multiple_insert_field: "",
      chartOfAccounts: [{}],
      attributes: {
        chart_of_accounts: [
          {
            chart_of_account: [],
          },
        ],
        percent: {
          field_id: null,
        },
        group_by_columns: [],
        summaries: [],
        name_ru: "",
      },
      filters: [],
      number_field: "",
      app_id: appId,
      order: views.length + 1,
    };
  }, [appId, selectedViewTab, tableSlug, views]);

  const createView = () => {
    setBtnLoader(true);
    constructorViewService
      .create(tableSlug, newViewJSON)
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS", tableSlug, i18n?.language]);
      })
      .finally(() => {
        setBtnLoader(false);
        handleClose();
      });
  };

  return (
    <div className={style.viewTypeList}>
      <div className={style.wrapper}>
        <div className={style.left}>
          {computedViewTypes.map((type, index) => (
            <Button
              key={index}
              className={type.value === selectedViewTab ? style.active : ""}
              onClick={() => {
                setSelectedViewTab(type.value);
              }}
            >
              {type.value === "TABLE" && <TableChart className={style.icon} />}
              {type.value === "CALENDAR" && <CalendarMonth className={style.icon} />}
              {type.value === "CALENDAR HOUR" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
              {type.value === "GANTT" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
              {type.value === "TREE" && <AccountTree className={style.icon} />}
              {type.value === "BOARD" && <IconGenerator className={style.icon} icon="brand_trello.svg" />}
              {type.value === "FINANCE CALENDAR" && <MonetizationOnIcon className={style.icon} />}
              {type.value === "TIMELINE" && <ClearAllIcon className={style.icon} />}
              {type.label}
            </Button>
          ))}
        </div>

        <div className={style.right}>
          <div className={style.img}>
            <img src={detectImageView} alt="add view" />
          </div>

          <div className={style.text}>
            <h3>{selectedViewTab}</h3>
            <p>{detectDescriptionView}</p>
          </div>

          <div className={style.button}>
            <LoadingButton
              variant="contained"
              loading={btnLoader}
              onClick={() => {
                // handleClose();
                // openModal();
                // setSelectedView("NEW");
                // setTypeNewView(selectedViewTab);
                createView();
              }}
            >
              Create View {selectedViewTab}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
