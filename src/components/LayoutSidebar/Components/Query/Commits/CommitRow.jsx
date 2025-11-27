import {format} from "date-fns";
import styles from "./index.module.scss";
import {BsArrowCounterclockwise} from "react-icons/bs";
import {BiSave} from "react-icons/bi";
import {useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useQueryClient} from "react-query";
import {Box, Icon, MenuItem, Select, Tooltip, Typography} from "@mui/material";
import RectangleIconButton from "../../../../Buttons/RectangleIconButton";
import {showAlert} from "../../../../../store/alert/alert.thunk";
import {useDispatch} from "react-redux";
import {useReleasesListQuery} from "../../../../../services/releaseService";
import listToOptions from "../../../../../utils/listToOptions";
import {useQueryVersionSelectMutation} from "../../../../../services/query.service";
import HFMultipleSelect from "../../../../FormElements/HFMultipleSelect";
import {EditIcon} from "../../../../../assets/icons/icon";
import {store} from "../../../../../store";
import CAutoCompleteSelect from "../../../../CAutoCompleteSelect";

const QueryCommitRow = ({
  commit,
  index,
  selectedCommit,
  onSelect,
  onRevertClick,
}) => {
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const {projectId, queryId} = useParams();
  const [versionIds, setVersionIds] = useState([]);
  const [versionSelectorIsOpen, setVersionSelectorIsOpen] = useState(false);
  const dispatch = useDispatch();
  const {data: releases} = useReleasesListQuery({
    projectId: company.projectId,
    queryParams: {
      select: (res) => listToOptions(res.releases, "version"),
    },
  });

  const versions = useMemo(() => {
    return Object.keys(commit.version_infos ?? {})
      ?.map(
        (versionId) =>
          releases?.find((release) => release.value === versionId)?.label
      )
      ?.join(", ");
  }, [commit, releases]);

  const isActive = (commit, index) => {
    if (!selectedCommit) {
      return index === 0;
    } else {
      return selectedCommit === commit.commit_info.id;
    }
  };

  const openVersionSelector = () => {
    setVersionIds(Object.keys(commit.version_infos ?? {}).filter((el) => el));
    setVersionSelectorIsOpen(true);
  };

  const {mutate: saveVersions, isLoading: saveLoading} =
    useQueryVersionSelectMutation({
      onSuccess: (res) => {
        dispatch(showAlert("Successfully saved versions"));
        setVersionSelectorIsOpen(false);
        queryClient.refetchQueries(["QUERY_HISTORY"]);
      },
    });

  const onSaveClick = () => {
    const data = {
      old_commit_id: commit.commit_info.id,
      project_id: projectId,
      version_ids: versionIds,
    };

    saveVersions({
      queryId,
      data,
    });
  };

  return (
    <Box
      key={commit.commit_info.id}
      className={`${styles.row} ${
        isActive(commit, index) ? styles.active : ""
      }`}
      onClick={() => onSelect(commit)}>
      <Box spacing={1} flex={1}>
        <Typography color="white" fontWeight="bold" fontSize="lg">
          {format(new Date(commit.commit_info.created_at), "dd MMMM, HH:mm")}
        </Typography>
        {!versionSelectorIsOpen ? (
          <Typography color="primary.300" fontStyle="italic">
            Versions: {versions}
            <RectangleIconButton
              onClick={openVersionSelector}
              display="inline-block"
              variant="ghost"
              colorScheme="primary">
              <EditIcon />
            </RectangleIconButton>
          </Typography>
        ) : (
          <Box onClick={(e) => e.stopPropagation()} color="white">
            <Box flex={1}>
              <Select
                multiple={true}
                value={versionIds || []}
                onChange={setVersionIds}
                label={"Roles"}
                fullWidth>
                {releases?.map((item) => (
                  <MenuItem style={{width: "100%"}} key={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <RectangleIconButton
              variant="ghost"
              colorScheme="blue"
              color="blue.200"
              onClick={(e) => {
                e.stopPropagation();
                onSaveClick();
              }}
              isLoading={saveLoading}>
              <Icon as={BiSave} w={6} h={6} />
            </RectangleIconButton>
          </Box>
        )}

        <Box>
          <Typography>{commit.commit_info.name?.split("-")?.[0]}</Typography>
        </Box>
      </Box>

      {!versionSelectorIsOpen && (
        <Tooltip label="Revert">
          <RectangleIconButton
            variant="ghost"
            colorScheme="blue"
            color="blue.200"
            onClick={(e) => {
              e.stopPropagation();
              onRevertClick(commit);
            }}>
            <Icon as={BsArrowCounterclockwise} w={6} h={6} />
          </RectangleIconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default QueryCommitRow;
