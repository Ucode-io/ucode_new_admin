import { useSelector } from "react-redux";
import AppSelector from "../../components/AppSelector";
import ChatRouter from "../../components/Chat/components/ChatRouter";
import FormSelector from "../../components/FormSelector";
import LanguageSelector from "../../components/LanguageSelector";
import ProfilePanel from "../../components/ProfilePanel";
import Notifications from "./Notification";
import RouteTabComponent from "./RouteTabComponent";
import styles from "./style.module.scss";
import ViewTabSelector from "../../views/Objects/components/ViewTypeSelector";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import { listToMap } from "../../utils/listToMap";
import PageFallback from "../../components/PageFallback";
import FiltersBlock from "../../components/FiltersBlock";
import DocView from "../../views/Objects/DocView";
import { TabPanel, Tabs } from "react-tabs";
import ViewsWithGroups from "../../views/Objects/ViewsWithGroups";
import GanttView from "../../views/Objects/GanttView";
import CalendarHourView from "../../views/Objects/CalendarHourView";
import CalendarView from "../../views/Objects/CalendarView";
import BoardView from "../../views/Objects/BoardView";

const RouterTabsBlock = ({ selectedTable }) => {
  const tabs = useSelector((state) => state.tabRouter.tabs);
  const { tableSlug, appId } = useParams();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get("view");

  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  // const {
  //   data: { views, fieldsMap } = {
  //     views: [],
  //     fieldsMap: {},
  //   },
  //   isLoading,
  // } = useQuery(
  //   ["GET_VIEWS_AND_FIELDS", tableSlug],
  //   () => {
  //     return constructorObjectService.getList(tableSlug, {
  //       data: { limit: 0, offset: 0, app_id: appId },
  //     });
  //   },
  //   {
  //     select: ({ data }) => {
  //       return {
  //         views: data?.views ?? [],
  //         fieldsMap: listToMap(data?.fields),
  //       };
  //     },
  //     onSuccess: ({ views }) => {
  //       if (state?.toDocsTab) setSelectedTabIndex(views?.length);
  //     },
  //   }
  // );
  useEffect(() => {
    queryTab
      ? setSelectedTabIndex(parseInt(queryTab - 1))
      : setSelectedTabIndex(0);
  }, [queryTab]);

  const setViews = () => {};
  // if (isLoading) return <PageFallback />;

  return (
    // <div className={styles.tabsBlock}>
    //   <div className={styles.leftSide}>
    //     {/* {tabs.map((tab) => (
    //       <RouteTabComponent key={tab.id} tab={tab} />
    //     ))}

    //     <FormSelector /> */}

    //   </div>

    //   <div className={styles.rightSide}>
    //     <LanguageSelector />
    //     <ChatRouter />
    //     <Notifications />
    //     <AppSelector />
    //     <ProfilePanel />
    //   </div>
    // </div>

    <></>

    // <>
    //   <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
    //     <div>
    //       {views.map((view) => {
    //         return (
    //           <TabPanel key={view.id}>
    //             {view.type === "BOARD" ? (
    //               <>
    //                 <BoardView
    //                   view={view}
    //                   setViews={setViews}
    //                   selectedTabIndex={selectedTabIndex}
    //                   setSelectedTabIndex={setSelectedTabIndex}
    //                   views={views}
    //                   fieldsMap={fieldsMap}
    //                   selectedTable={selectedTable}
    //                 />
    //               </>
    //             ) : view.type === "CALENDAR" ? (
    //               <>
    //                 <CalendarView
    //                   view={view}
    //                   setViews={setViews}
    //                   selectedTabIndex={selectedTabIndex}
    //                   setSelectedTabIndex={setSelectedTabIndex}
    //                   views={views}
    //                   fieldsMap={fieldsMap}
    //                   selectedTable={selectedTable}
    //                 />
    //               </>
    //             ) : view.type === "CALENDAR HOUR" ? (
    //               <>
    //                 <CalendarHourView
    //                   view={view}
    //                   setViews={setViews}
    //                   selectedTabIndex={selectedTabIndex}
    //                   setSelectedTabIndex={setSelectedTabIndex}
    //                   views={views}
    //                   fieldsMap={fieldsMap}
    //                   selectedTable={selectedTable}
    //                 />
    //               </>
    //             ) : view.type === "GANTT" ? (
    //               <>
    //                 <GanttView
    //                   view={view}
    //                   setViews={setViews}
    //                   selectedTabIndex={selectedTabIndex}
    //                   setSelectedTabIndex={setSelectedTabIndex}
    //                   views={views}
    //                   fieldsMap={fieldsMap}
    //                   selectedTable={selectedTable}
    //                 />
    //               </>
    //             ) : (
    //               <>
    //                 <ViewsWithGroups
    //                   selectedTable={selectedTable}
    //                   selectedTabIndex={selectedTabIndex}
    //                   setSelectedTabIndex={setSelectedTabIndex}
    //                   views={views}
    //                   view={view}
    //                   fieldsMap={fieldsMap}
    //                 />
    //               </>
    //             )}
    //           </TabPanel>
    //         );
    //       })}
    //       {/* <TabPanel>
    //         <DocView views={views} fieldsMap={fieldsMap} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
    //       </TabPanel> */}
    //     </div>
    //   </Tabs>

    //   {!views?.length && (
    //     <FiltersBlock>
    //       <ViewTabSelector selectedTable={selectedTable} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} views={views} />
    //     </FiltersBlock>
    //   )}
    // </>
  );
};

export default RouterTabsBlock;
