
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SimpleLoader from "../../../../components/Loaders/SimpleLoader"
import {
  useResourceCreateFromClusterMutation,
  useResourceDeleteMutation,
  useResourceListQuery,
} from "../../../../services/resource.service"
import authStore from "../../../../store/auth.store"
import { Box, Button } from "@mui/material"

const Recources = () => {
  const { projectId } = useParams()

  const {
    data: { count, resources } = {},
    isLoading,
    refetch,
  } = useResourceListQuery({
    params: {
      project_id: projectId,
    },
  })

  const { mutate: deleteResource, isLoading: deleteLoading } =
    useResourceDeleteMutation({
      onSuccess: () => {
        refetch()
      },
    })

  const { mutate: addResourceFromCluster, isLoading: clusterLoading } =
    useResourceCreateFromClusterMutation({
      onSuccess: () => {
        refetch()
      },
    })

  const addResourceFromClusterClick = () => {
    addResourceFromCluster({
      company_id: authStore.currentCompanyID,
      project_id: projectId,
      resource: {
        resource_type: 1,
        service_type: 1,
      },
      user_id: authStore.userId,
    })
  }

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const navigateToCreateForm = () => {
    navigate(`${pathname}/create`)
  }

  const navigateToEditPage = (id) => {
    navigate(`${pathname}/${id}`)
  }

  return (
    <Box flex={1}>
      <Box>
        <Box>
        <Button link={-1} />
          <h2>Project resources</h2>
        </Box>
        <Box pr={4} gap={3}>
          <Button
            isLoading={clusterLoading}
            variant="outline"
            onClick={addResourceFromClusterClick}
            isDisabled={true}
          >
            Add resource from Ucode
          </Button>
          <Button onClick={navigateToCreateForm}>Add resource</Button>
        </Box>
      </Box>

      {isLoading || deleteLoading ? (
        // <SimpleLoader h={300} />
        <h2>Loader</h2>
      ) : (
        // <Box>TableContainer</Box>
        <TableContainer>
          <Table>
            <THead>
              <Tr>
                <Th w={2}>No</Th>
                <Th>Title</Th>
                <Th w={20}></Th>
              </Tr>
            </THead>
            <TBody>
              {resources?.map((resource, index) => (
                <Tr key={resource.id}>
                  <Td textAlign="center" >{index + 1}</Td>
                  <Td>{resource.title}</Td>
                  <Td>
                    <HStack>
                      <IconButton
                        onClick={() => navigateToEditPage(resource.id)}
                        colorScheme="green"
                        icon={<EditIcon />}
                      />
                      <IconButton
                        onClick={() =>
                          deleteResource({
                            id: resource.id,
                          })
                        }
                        colorScheme="red"
                        icon={<DeleteIcon />}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default Recources
