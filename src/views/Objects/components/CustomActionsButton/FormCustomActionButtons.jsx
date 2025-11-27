import { useMemo } from "react";
import useCustomActionsQuery from "../../../../queries/hooks/useCustomActionsQuery";
import ActionButton from "./ActionButton";

const FormCustomActionButton = ({ tableSlug, id, control, getAllData }) => {
  const { data: { custom_events: customEvents = [] } = {} } =
    useCustomActionsQuery({
      tableSlug,
      queryPayload: { hasId: !!id },
      queryParams: {
        enabled: !!id,
      },
    });
    
    const computedCustomEvents = useMemo(() => {
      return customEvents?.filter(event => event.action_type === "HTTP")
    }, [customEvents])

  return (
    <>
      {computedCustomEvents?.map((event) =>
        event?.action_permission &&
        event?.action_permission?.permission === true ? (
          <ActionButton
            control={control}
            key={event.id}
            event={event}
            id={id}
            getAllData={getAllData}
          />
        ) : (
          ""
        )
      )}
    </>
  );
};

export default FormCustomActionButton;
