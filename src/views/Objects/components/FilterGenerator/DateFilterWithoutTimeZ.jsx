import CRangePickerNew from "../../../../components/DatePickers/CRangePickerNew";
import CRangePickerNewWithoutTime from "../../../../components/DatePickers/CRangePickerNewWithoutTime";
import OneCDateTimePickerWithout from "../../../../components/DatePickers/OneCDateTimePickerWithout";

const DateFilterWithoutTimeZ = ({onChange, value, placeholder, field}) => {
  return (
    <>
      <CRangePickerNewWithoutTime
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default DateFilterWithoutTimeZ;
