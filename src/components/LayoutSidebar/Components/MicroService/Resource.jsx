import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { CTableCell, CTableRow } from "../../../CTable";
import HFSelect from "../../../FormElements/HFSelect";

const Resource = ({
  resource,
  services,
  index,
  response,
  resources,
  resourceTypes,
  control,
}) => {
  const watchResource = useWatch({
    control,
    name: `service_resources.${index}.resource_type`,
  });

  const filteredOptionsMemo = useMemo(() => {
    return resources
      ?.filter((item) => item.resource_type === watchResource)
      .map((el) => ({
        value: el.id,
        label: el.title,
      }));
  }, [watchResource, resources]);

  const types = useMemo(() => {
    return resourceTypes?.map((item) => ({
      value: item.resource_type,
      label: item.resource_type_title,
    }));
  }, [resourceTypes]);

  return (
    <CTableRow key={resource.resource_id}>
      <CTableCell textAlign="center">{index + 1}</CTableCell>
      <CTableCell>{resource.title}</CTableCell>
      <CTableCell style={{ overflow: "inherit" }}>
        <HFSelect
          control={control}
          placeholder="Resource"
          options={types}
          name={`service_resources.${index}.resource_type`}
        />
      </CTableCell>
      <CTableCell style={{ overflow: "inherit" }}>
        <HFSelect
          control={control}
          placeholder="Type"
          options={filteredOptionsMemo}
          name={`service_resources.${index}.resource_id`}
        />
      </CTableCell>
    </CTableRow>
  );
};

export default Resource;
