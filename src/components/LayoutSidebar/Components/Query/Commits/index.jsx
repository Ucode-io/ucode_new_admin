import { useQueryClient } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import QueryCommitRow from "./CommitRow.jsx";
import styles from "./index.module.scss";
import { Box } from "@mui/material";
import RectangleIconButton from "../../../../Buttons/RectangleIconButton/index.jsx";
import {
  useQueryByIdQuery,
  useQueryHistoryQuery,
  useQueryRevertCommitMutation,
} from "../../../../../services/query.service.js";
import { CloseIcon } from "../../../../../assets/icons/icon.jsx";

const flexStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
};

const QueryCommitsView = ({ closeView, form, style }) => {
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useSearchParams();
  const { projectId, queryId } = useParams();

  const selectedCommit = queryParams.get("commit_id");

  const { data: commits, refetch } = useQueryHistoryQuery({
    projectId,
    queryId,
    queryParams: {
      select: (res) => res.queries,
    },
  });

  const { mutate: revert } = useQueryRevertCommitMutation({
    onSuccess: (res) => {
      refetch();
      setQueryParams({});
      queryClient.refetchQueries(["QUERY_BY_ID", { fieldId: queryId }]);
      form.reset(res);
    },
  });

  const { isLoading } = useQueryByIdQuery({
    id: queryId,
    params: { "project-id": projectId, "commit-id": selectedCommit },
    queryParams: {
      enabled: Boolean(selectedCommit),
      onSuccess: (res) => form.reset(res),
      cacheTime: false,
    },
  });

  const onSelect = (commit) => {
    setQueryParams({
      commit_id: commit.commit_info.id,
    });
  };

  const onRevertClick = (commit) => {
    revert({
      queryId: queryId,
      data: {
        ...commit,
        commit_id: commit.commit_info.id,
        project_id: projectId,
      },
    });
  };

  const onCloseClick = () => {
    setQueryParams({});
    closeView();
  };

  return (
    <Box className={styles.block} style={style}>
      <Box
        style={flexStyle}
        columnGap={1}
        px={4}
        height="50px"
        borderBottom="1px solid #ffffff26"
      >
        <Box
          fontFamily="Inter"
          fontSize="16px"
          color="white"
          fontWeight={600}
          flex={1}
        >
          Query commit history
        </Box>
        <RectangleIconButton
          onClick={onCloseClick}
          colorScheme="whiteAlpha"
          variant="ghost"
        >
          <CloseIcon />
        </RectangleIconButton>
      </Box>

      <Box height="calc(100vh - 50px)" overflow="auto">
        {commits?.map((commit, index) => (
          <QueryCommitRow
            commit={commit}
            index={index}
            selectedCommit={selectedCommit}
            onRevertClick={onRevertClick}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </Box>
  );
};

export default QueryCommitsView;
