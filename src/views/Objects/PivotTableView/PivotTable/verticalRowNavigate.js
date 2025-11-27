import { useNavigate, useParams } from "react-router-dom";

export default function useVerticalRowNavigate(
  level,
  expandedRows,
  findExpandRow
) {
  const navigate = useNavigate();
  const { appId } = useParams();

  const navigateToEditPage = (row, field, aa) => {
    if (row.guid && row.slug_type !== "RELATION") {
      function getArray(row) {
        if (!row.child) {
          return [row];
        }
        return [...getArray(row.child), row];
      }

      if (level === 0) {
        navigate(`/main/${appId}/object/${field.table_slug}`, {
          state: { [row.table_slug]: [row.guid] },
        });
      } else {
        if (expandedRows.length) {
          const foundExpandedRow =
            findExpandRow([...row.parent_ids, row.guid].join("#")) ??
            findExpandRow([...row.parent_ids].join("#"));

          const makeState = {};
          getArray(foundExpandedRow)
            .filter((r) => r.row_slug_type !== "RELATION")
            .forEach((i) => {
              makeState[i.slug] = [i.real_value];
            });
          navigate(`/main/${appId}/object/${field.table_slug}`, {
            state: { ...makeState, [row.table_slug]: [row.guid] },
          });
        }
      }
    }
  };

  return { navigateToEditPage };
}
