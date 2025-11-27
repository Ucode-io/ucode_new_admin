import FRow from "../../../../../../components/FormElements/FRow";
import HFTextField from "../../../../../../components/FormElements/HFTextField";

const MapAttributes = ({ control }) => {
  return (
    <>
      <div className="p-2">
        <FRow label="Lattitude">
          <HFTextField name="attributes.lat" control={control} fullWidth />
        </FRow>
        <FRow label="Longitude">
          <HFTextField name="attributes.long" control={control} fullWidth />
        </FRow>
        <FRow label="Api key">
          <HFTextField name="attributes.apiKey" control={control} fullWidth />
        </FRow>
      </div>
    </>
  );
};

export default MapAttributes;
