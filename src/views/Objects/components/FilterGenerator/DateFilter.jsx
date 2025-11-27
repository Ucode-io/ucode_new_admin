import CRangePickerNew from "../../../../components/DatePickers/CRangePickerNew";

const DateFilter = ({onChange, value, placeholder, field}) => {
  return (
    <>
      <CRangePickerNew
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default DateFilter;
