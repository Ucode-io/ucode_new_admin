import {useState} from "react";
import {useWatch} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useMemo} from "react";
import {CTableCell, CTableHeadRow} from "../../../../../components/CTable";
import {Box, Button, Checkbox} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {useMenuPermissionGetByIdQuery} from "../../../../../services/rolePermissionService";
import {store} from "../../../../../store";
import {useTranslation} from "react-i18next";

const MenuRow = ({
  app,
  appIndex,
  control,
  level = 1,
  setChangedData,
  changedData,
  setValue,
  allMenus,
  childIndex,
  setCheckBoxValues,
  checkBoxValues,
}) => {
  const {roleId} = useParams();
  const [tableBlockIsOpen, setTableBlockIsOpen] = useState(false);
  const [parentId, setParentId] = useState("");
  const [data, setData] = useState([]);
  const projectId = store.getState().company.projectId;
  const {i18n} = useTranslation();
  const table = useWatch({
    control,
    name: `menus.${appIndex}`,
  });

  const getIndex = useMemo(() => {
    return allMenus?.findIndex(
      (item) =>
        item?.id === changedData?.find((item) => table?.id === item?.id)?.id
    );
  }, [changedData]);

  const {data: permissionData, isLoading: permissionGetByIdLoading} =
    useMenuPermissionGetByIdQuery({
      projectId: projectId,
      roleId: roleId,
      parentId: parentId,
      queryParams: {
        enabled: !!parentId,
        onSuccess: (res) => {
          const obj = {};

          res?.menus?.forEach((item) => {
            obj[item?.id] = item.permission;
          });

          setCheckBoxValues((prev) => ({...prev, ...obj}));

          setData(res?.menus);
          if (!parentId) {
            setValue(`menus`, res?.menus);
          } else {
            setValue(`menus.${appIndex}.children`, res?.menus);
          }
        },
      },
    });

  const renderMenuRows = (items) => {
    return items?.map((item, index) => (
      <MenuRow
        key={item.id}
        app={item}
        appIndex={appIndex}
        childIndex={index}
        control={control}
        level={level + 1}
        setChangedData={setChangedData}
        changedData={changedData}
        setValue={setValue}
        checkBoxValues={checkBoxValues}
        setCheckBoxValues={setCheckBoxValues}
      />
    ));
  };

  const rowPermissions = useMemo(() => {
    return checkBoxValues?.[app?.id];
  }, [checkBoxValues, app?.id]);

  const detectDuplicate = (checked, type) => {
    if (changedData?.find((obj) => obj?.id === app?.id)?.id) {
      const computedData = changedData.map((item) => {
        if (app?.id === item?.id) {
          return {
            ...item,
            permission: {
              ...item.permission,
              [type]: checked,
            },
          };
        } else {
          return item;
        }
      });
      setChangedData(computedData);
    } else {
      setChangedData([
        ...changedData,
        {
          ...app,
          permission: {
            ...app.permission,
            [type]: checked,
          },
        },
      ]);
    }
  };

  const handleChange = (e, type) => {
    detectDuplicate(e, type);

    setCheckBoxValues((prev) => ({
      ...prev,
      [app?.id]: {
        ...prev?.[app?.id],
        [type]: e,
      },
    }));
  };

  return (
    <>
      {app?.type === "FOLDER" ? (
        <CTableHeadRow pl={4}>
          <CTableCell
            fontWeight="bold"
            cursor="pointer"
            onClick={() => {
              setTableBlockIsOpen((prev) => !prev);
              setParentId(app?.id);
            }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center">
              {app?.attributes?.[`label_${i18n?.language}`] ??
                app?.attributes?.[`title_${i18n?.language}`] ??
                app.label}
              <Button
                variant="text"
                style={{
                  padding: "0",
                  justifyContent: "flex-end",
                }}
                disabled>
                <ArrowForwardIosIcon
                  style={{
                    transform: `rotate(${tableBlockIsOpen ? 90 : -90}deg)`,
                  }}
                />
              </Button>
            </Box>
          </CTableCell>

          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.read, "read");
              }}
              checked={rowPermissions?.read ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.write, "write");
              }}
              checked={rowPermissions?.write ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.update, "update");
              }}
              checked={rowPermissions?.update ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.delete, "delete");
              }}
              checked={rowPermissions?.delete ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.menu_settings, "menu_settings");
              }}
              checked={rowPermissions?.menu_settings ?? false}
            />
          </CTableCell>
        </CTableHeadRow>
      ) : (
        <CTableHeadRow>
          <CTableCell cursor="pointer">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center">
              {app?.attributes?.[`label_${i18n?.language}`] ??
                app?.attributes?.[`title_${i18n?.language}`] ??
                app.label}
            </Box>
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.read, "read");
              }}
              checked={rowPermissions?.read ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.write, "write");
              }}
              checked={rowPermissions?.write ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.update, "update");
              }}
              checked={rowPermissions?.update ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.delete, "delete");
              }}
              checked={rowPermissions?.delete ?? false}
            />
          </CTableCell>
          <CTableCell>
            <Checkbox
              onChange={() => {
                handleChange(!rowPermissions?.menu_settings, "menu_settings");
              }}
              checked={rowPermissions?.menu_settings ?? false}
            />
          </CTableCell>
        </CTableHeadRow>
      )}

      {tableBlockIsOpen && renderMenuRows(data)}
    </>
  );
};

export default MenuRow;
