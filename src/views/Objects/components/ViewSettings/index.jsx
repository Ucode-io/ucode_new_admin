import { Close } from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import constructorObjectService from "../../../../services/constructorObjectService";
import styles from "./style.module.scss";
import ViewForm from "./ViewForm";
import ViewsList from "./ViewsList";
import constructorTableService from "../../../../services/constructorTableService";

const ViewSettings = ({ closeModal, setIsChanged, isChanged, viewData, typeNewView, defaultViewTab, setTab }) => {
  const { tableSlug, appId } = useParams();
  const [selectedView, setSelectedView] = useState(viewData);
  const closeForm = () => setSelectedView(null);

  const {
    data: { fields, views, columns, relationColumns } = {
      fields: [],
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: { limit: 10, offset: 0, with_relations: true, app_id: appId },
      });
    },
    {
      select: ({ data }) => {
        return {
          fields: data?.fields ?? [],
          views: data?.views ?? [],
          columns: data?.fields ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  useEffect(() => {
    if (isChanged === true) {
      refetchViews();
      closeModal();
    }
  }, [isChanged]);

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cardTitle}>View settings</div>
        <IconButton className={styles.closeButton} onClick={closeModal}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>

      {isLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <div className={styles.body}>
          {/* <ViewsList
            views={views}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          /> */}

          {selectedView && (
            <ViewForm
              initialValues={selectedView}
              typeNewView={typeNewView}
              closeForm={closeForm}
              refetchViews={refetchViews}
              closeModal={closeModal}
              setIsChanged={setIsChanged}
              defaultViewTab={defaultViewTab}
              columns={columns}
              views={views}
              relationColumns={relationColumns}
              setTab={setTab}
              fields={fields}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default ViewSettings;
