import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import FiltersBlock from "../../components/FiltersBlock";
import HeaderSettings from "../../components/HeaderSettings";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../components/TableCard";
import TableRowButton from "../../components/TableRowButton";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import { Add, Delete } from "@mui/icons-material";
import { store } from "../../store";
import { useQueryClient } from "react-query";
import { showAlert } from "../../store/alert/alert.thunk";
import {
  useRedirectDeleteMutation,
  useRedirectListQuery,
  useRedirectUpdateReorderMutation,
} from "../../services/redirectService";
import { format } from "date-fns";
import { applyDrag } from "../../utils/applyDrag";
import { Container, Draggable } from "react-smooth-dnd";
import { useState } from "react";
import SecondaryButton from "../../components/Buttons/SecondaryButton";

const RedirectPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [computedData, setComputedData] = useState();

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const { isLoading: redirectLoading } = useRedirectListQuery({
    queryParams: {
      onSuccess: (res) => setComputedData(res?.redirect_urls),
    },
  });

  const { mutateAsync: deleteRedirect, isLoading: createLoading } =
    useRedirectDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["REDIRECT"]);
      },
    });
  const { mutateAsync: updateReorder, isLoading: reorderLoading } =
    useRedirectUpdateReorderMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["REDIRECT"]);
      },
    });

  const deleteRedirectElement = (id) => {
    deleteRedirect(id);
  };


  const onDrop = (dropResult, index) => {
    const result = applyDrag(computedData, dropResult);
    if (result) {
      setComputedData(result);
      updateReorder({ ids: result.map((item) => item?.id) });
    }
  };


  return (
    <div>
      <HeaderSettings title={"Redirects"} line={false} />

      <TableCard>
        <div style={{ display: "flex", flexDirection: "column", boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)", borderRadius: "6px" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", borderBottom: "1px solid rgba(0, 0, 0, 0.12)", fontWeight: "bold" }}>
            <div style={{ width: 50, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>№</div>
            <div style={{ flex: 2, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>From</div>
            <div style={{ flex: 1, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>To</div>
            <div style={{ flex: 1, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>Created at</div>
            <div style={{ flex: 1, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>Updated at</div>
            <div style={{ width: 60 }}></div>
          </div>
          <Container
            style={{
              height: "calc(100vh - 170px)",
              overflow: "auto",
              borderRadius: "6px",
            }}
            groupName="subtask"
            onDrop={onDrop}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
          >
            {computedData?.map((element, index) => (
              <Draggable key={element.id}>
                <div onClick={() => navigateToEditForm(element.id)} style={{ display: "flex", flexDirection: "row", alignItems: "center", borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
                  <div style={{ width: 50, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>{index + 1}</div>
                  <div style={{ flex: 2, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>{element?.from}</div>
                  <div style={{ flex: 1, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>{element?.to}</div>
                  <div style={{ flex: 1, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>
                    {format(new Date(element?.created_at), "MMMM d, yyyy 'at' kk:mm")}
                  </div>
                  <div style={{ flex: 1, borderRight: "1px solid rgba(0, 0, 0, 0.12)", padding: "8px" }}>
                    {format(new Date(element?.updated_at), "MMMM d, yyyy 'at' kk:mm")}
                  </div>
                  <div style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RectangleIconButton
                      color="error"
                      onClick={() => {
                        deleteRedirectElement(element.id);
                      }}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </div>
                </div>
              </Draggable>
            ))}
            <SecondaryButton
              type="button"
              style={{ width: "100%", marginTop: '10px' }}
              onClick={navigateToCreateForm}
            >
              <Add />
              Add
            </SecondaryButton>
          </Container>
        </div>
      </TableCard>
    </div>
  )
};

export default RedirectPage;
