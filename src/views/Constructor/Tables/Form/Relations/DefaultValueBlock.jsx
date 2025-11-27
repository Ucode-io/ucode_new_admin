import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";

const DefaultValueBlock = ({ control, watch, columnsList }) => {
  const relation = watch();
  
  if (!relation.table_to || !relation.table_from) return null;
  return (
    <div style={{ padding: 0, display: "flex", columnGap: "16px", marginBottom: "8px" }}>
      <HFCheckbox
        control={control}
        label={"Свой ID"}
        name="is_user_id_default"
        required
      />

      <HFCheckbox
        control={control}
        label={"JWT object ID"}
        name="object_id_from_jwt"
        required
      />
    </div>
  );
};

export default DefaultValueBlock;
