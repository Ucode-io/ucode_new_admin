import { Button, Icon } from "@mui/material";
import { format } from "date-fns";
import { useMemo } from "react";
import { ImPriceTag } from "react-icons/im";
import { RiHistoryLine } from "react-icons/ri";

const CommitButton = ({ info, color, ...props }) => {
  const versions = useMemo(() => {
    return (
      info?.version_infos?.map((version) => version.version).join(", ") ?? ""
    );
  }, [info]);

  return (
    <Button variant="outlined" color={color} {...props}>
      <Icon as={RiHistoryLine} color={color ?? "primary"} w={4} h={4} mr={1} />
      <span style={{ color: color || "primary" }}>
        {info?.created_at &&
          format(new Date(info.created_at), "dd MMMM, HH:mm")}
      </span>
      {versions && (
        <>
          <span mx={2}>|</span>
          <Icon as={ImPriceTag} w={4} h={4} mr={2} />
          <span>{versions}</span>
        </>
      )}
    </Button>
  );
};

export default CommitButton;
