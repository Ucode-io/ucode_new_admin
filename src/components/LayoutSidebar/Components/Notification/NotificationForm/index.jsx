import { Save } from "@mui/icons-material";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../../../components/Buttons/SecondaryButton";
import Footer from "../../../../../components/Footer";
import FormCard from "../../../../../components/FormCard";
import FRow from "../../../../../components/FormElements/FRow";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import HeaderSettings from "../../../../../components/HeaderSettings";
import PageFallback from "../../../../../components/PageFallback";
import PermissionWrapperV2 from "../../../../../components/PermissionWrapper/PermissionWrapperV2";
import { useQueryClient } from "react-query";
import { store } from "../../../../../store";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import {
  useNotificationCreateMutation,
  useNotificationGetByIdQuery,
  useNotificationUpdateMutation,
} from "../../../../../services/notificationsService";
import { useObjectsListQuery } from "../../../../../services/constructorObjectService";
import { useUserUpdateMutation } from "../../../../../services/userService";
import { useDispatch } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Box, Typography } from "@mui/material";

const NotificationForm = () => {
  const { categoryId, notificationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const companyId = store.getState().company.companyId;

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      category_id: categoryId,
      notificationData: {
        notification_info: [
          {
            title: "",
            code: "UZB",
            content: "",
          },
          {
            title: "",
            code: "RUS",
            content: "",
          },
          {
            title: "",
            code: "ENG",
            content: "",
          },
        ],
      },
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "notificationData.notification_info",
  });
  const { isLoading } = useNotificationGetByIdQuery({
    notificationId: notificationId,
    queryParams: {
      cacheTime: 10,
      enabled: !!notificationId,
      onSuccess: (res) => {
        reset({
          notificationData: {
            ...res,
            notification_info: res.notification_info,
          },
          title: res?.title,
        });
      },
    },
  });

  const { data: users } = useObjectsListQuery({
    params: {
      tableSlug: "user",
    },
  });

  const { mutateAsync: createNotif, isLoading: createLoading } =
    useNotificationCreateMutation();
  const { mutateAsync: updateNorif, isLoading: updateLoading } =
    useNotificationUpdateMutation();

  const onSubmit = async (values) => {
    const computedValues = {
      ...values,
      notifs: users?.data.response?.map((item) => ({ user_id: item?.guid })),
    };

    try {
      if (notificationId) {
        await updateNorif(computedValues);
        queryClient.refetchQueries(["NOTIFICATION"]);
        dispatch(showAlert("Success", "success"));
      } else {
        await createNotif(computedValues);
        queryClient.refetchQueries(["NOTIFICATION"]);
        dispatch(showAlert("Success", "success"));
      }
      navigate(-1);
    } catch (error) {}
  };

  if (updateLoading) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Projects"
        backButtonLink={-1}
        subtitle={notificationId ? watch("name") : "Новый"}
      ></HeaderSettings>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Title"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="title"
              control={control}
              fullWidth
              required
            />
          </FRow>
          <Tabs direction={"ltr"}>
            <TabList>
              <Tab>Uzb</Tab>
              <Tab>Rus</Tab>
              <Tab>Eng</Tab>
            </TabList>
            {fields.map((item, idx) => (
              <TabPanel
                key={item.id}
                style={{
                  marginTop: "10px",
                }}
              >
                <FRow
                  label={"Title"}
                  componentClassName="flex gap-2 align-center"
                  required
                >
                  <HFTextField
                    disabledHelperText
                    name={`notificationData.notification_info.${idx}.title`}
                    control={control}
                    fullWidth
                    required
                  />
                </FRow>
                <FRow
                  label={"Content"}
                  componentClassName="flex gap-2 align-center"
                  required
                >
                  <HFTextField
                    disabledHelperText
                    name={`notificationData.notification_info.${idx}.content`}
                    control={control}
                    fullWidth
                    required
                  />
                </FRow>
              </TabPanel>
            ))}
          </Tabs>
          <Box>
            <Typography
              style={{
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Success sends: {watch("notificationData.success_sends") || 0}
            </Typography>
            <Typography
              style={{
                fontWeight: "600",
              }}
            >
              Failer sends: {watch("notificationData.failed_sends") || 0}
            </Typography>
          </Box>
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
                onClick={handleSubmit(onSubmit)}
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

export default NotificationForm;
