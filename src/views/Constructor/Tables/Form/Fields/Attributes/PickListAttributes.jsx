import FRow from "../../../../../../components/FormElements/FRow";
import HFCheckbox from "../../../../../../components/FormElements/HFCheckbox";
import SelectOptionsCreator from "../../../../../../components/SelectOptionsCreator";

const PickListAttributes = ({ control, onClose, onSaveButtonClick }) => {
  return (
    <>
      <div className="p-2">
        <HFCheckbox
          control={control}
          name="attributes.has_color"
          label="Color"
        />
        <HFCheckbox
          control={control}
          name="attributes.is_multiselect"
          label="Multiselect"
        />

        <FRow>
          <SelectOptionsCreator control={control} name="attributes.options" />
        </FRow>
      </div>
    </>
  );
};

export default PickListAttributes;
