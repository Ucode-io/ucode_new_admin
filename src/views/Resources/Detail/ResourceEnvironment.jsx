import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
// import ColorCircle from "../../../../components/ColorCircle";
import { Box } from "@mui/material";
import { useEnvironmentsListQuery } from "../../../services/environmentService";
import { CheckIcon, CloseIcon } from "../../../assets/icons/icon";
import { background } from "@chakra-ui/react";

const circle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  // backgroundColor: 'red',
  border: '1px solid silver',
}

const ResourceeEnvironments = ({
  control,
  selectedEnvironment,
  setSelectedEnvironment,
}) => {
  const { projectId } = useParams();
  const environmentClickHandler = (environment) => {
    setSelectedEnvironment(environment);
  };

  const environments = useWatch({
    control,
    name: "environments",
  });

  const { data: projectEnvironments } = useEnvironmentsListQuery({
    params: {
      project_id: projectId,
    },
    queryParams: {
      select: (res) =>
        res.environments?.map((env) => ({
          ...env,
          is_configured: false,
        })) ?? [],
    },
  });

  const computedEnvironments = useMemo(() => {
    if (environments?.length) return environments;
    else return projectEnvironments;
  }, [environments, projectEnvironments]);


  return (
      <Box sx={{width: '250px', borderRight: '1px solid #e5e9eb', padding: '15px'}}>
        <Box >
          <h2 fontSize={"18px"} mb={4}>
            All users
          </h2>
          <p>
            Resources let you connect to your database or API. Once you add a
            resource here, you can use it in all your apps.
          </p>
        </Box>

        <Box sx={{marginTop: '20px'}}>
          <h2>Environments</h2>
         </Box>

        <Box h={`calc(100vh - 250px)`}>
          <Box>
            {computedEnvironments?.map((environment, index) => (
              <Box sx={{display: 'flex'}}
                key={environment.id}
                // _hover={{ bg: "gray.100" }}
                // onClick={() => environmentClickHandler(environment)}
                color={
                  selectedEnvironment?.[0]?.id === environment.id
                    ? "primary.500"
                    : ""
                }
                cursor="pointer"
              >
                <Box sx={{display: 'flex', marginTop: '10px'}} alignItems="center" gap={2} flex={1}>
                <Box sx={{...circle, background: environment.display_color ?? '#fff', borderColor: environment.display_color ?? '#fff'}} /> 
                  <p>{environment.name}</p>
                </Box>
                {environment.is_configured ? (
                  <Box sx={{display: 'flex'}} alignItems="center" mt={1} gap={2}>
                    <CheckIcon color="green" />
                    <p>Connected</p>
                  </Box>
                ) : (
                  <Box sx={{display: 'flex', alignItems:'center'}} mt={1} gap={2}>
                    <CloseIcon color="red" />
                    <Box>Configure</Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
  );
};

export default ResourceeEnvironments;
