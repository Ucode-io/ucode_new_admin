import { Save, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import Footer from "../../components/Footer";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
import PageFallback from "../../components/PageFallback";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import { useQuery, useQueryClient } from "react-query";
import { store } from "../../store";
import { showAlert } from "../../store/alert/alert.thunk";
import {
  useUserCreateMutation,
  useUserGetByIdQuery,
  useUserUpdateMutation,
} from "../../services/auth/userService";
import HFSelect from "../../components/FormElements/HFSelect";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import roleServiceV2 from "../../services/roleServiceV2";
import HFSwitch from "../../components/FormElements/HFSwitch";
import { useEffect, useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import menuService from "../../services/menuService";

const ClientUserForm = () => {
  const { userId, userMenuId } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
      .getByID({
        menuId: searchParams.get("menuId"),
      })
      .then((res) => {
        setMenuItem(res);
      });
    }
  }, []);

  const invite = Boolean(menuItem?.table_slug);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const mainForm = useForm({
    defaultValues: {
      company_id: company.companyId,
      project_id: company.projectId,
    },
  });
  const { isLoading } = useUserGetByIdQuery({
    userId: userId,
    params: {
      "client-type-id": userMenuId,
    },
    queryParams: {
      enabled: Boolean(userId),
      onSuccess: (res) => {
        mainForm.reset(res);
      },
    },
  });
  const { data: computedClientTypes = [] } = useQuery(
    ["GET_CLIENT_TYPE_LIST"],
    () => {
      return clientTypeServiceV2.getList();
    },
    {
      select: (res) =>
        res.data.response?.map((row) => ({
          label: row.name,
          value: row.guid,
        })),
    }
  );
  const { data: computedRoles = [] } = useQuery(
    ["GET_ROLES_TYPE", mainForm.watch("client_type_id")],
    () => {
      return roleServiceV2.getList({
        "client-type-id": mainForm.watch("client_type_id"),
      });
    },
    {
      enabled: !!mainForm.watch("client_type_id"),
      select: (res) =>
        res.data.response?.map((row) => ({
          label: row.name,
          value: row.guid,
        })),
    }
  );

  const { mutateAsync: createProject, isLoading: createLoading } =
    useUserCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["USER"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });

  const { mutateAsync: updateProject, isLoading: updateLoading } =
    useUserUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["USER"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });

  const onSubmit = (data) => {
    if (userId) updateProject({ ...data, active: data.active ? 1 : 0 });
    else
      createProject({ ...data, active: data.active ? 1 : 0, invite: invite });
  };

  if (updateLoading) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Projects"
        backButtonLink={-1}
        subtitle={userId ? mainForm.watch("name") : "Новый"}
      ></HeaderSettings>
      <form
        onSubmit={mainForm.handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Name"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="name"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Email"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="email"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Login"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="login"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Password"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="password"
              control={mainForm.control}
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    color="primary"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FRow>
          <FRow
            label={"Phone"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="phone"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"User type"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFSelect
              name="client_type_id"
              options={computedClientTypes}
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Role"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFSelect
              name="role_id"
              options={computedRoles}
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow label={"Role"} componentClassName="flex gap-2 align-center">
            <HFSwitch control={mainForm.control} label="Active" name="active" />
          </FRow>
        </FormCard>
      </form>
      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Close
            </SecondaryButton>
            <PermissionWrapperV2 tabelSlug="app" type="update">
              <PrimaryButton
                loader={createLoading}
                onClick={mainForm.handleSubmit(onSubmit)}
              >
                <Save /> Save
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
};

export default ClientUserForm;
