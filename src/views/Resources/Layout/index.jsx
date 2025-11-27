import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { AiFillFolder } from "react-icons/ai";
import { FiDatabase } from "react-icons/fi";
import NestedSidebar from "../../../../components/Sidebar";
import Recources from "../List"

const sidebarElements = [
  {
    title: 'First folder',
    icon: AiFillFolder,
    id: 1,
    children: [
      {
        title: 'First resource',
        icon: FiDatabase,
        id: 2,
      },
      {
        title: 'Second resource',
        icon: FiDatabase,
        id: 3,
      }
    ]
  },
  {
    title: 'Second folder',
    icon: AiFillFolder,
    id: 4,
    children: [
      {
        title: 'Third resource',
        icon: FiDatabase,
        id: 5,
        children: [
          {
            title: 'First resource',
            icon: FiDatabase,
            id: 6,
          },
          {
            title: 'Second resource',
            icon: FiDatabase,
            id: 7,
          }
        ]
      }
    ]
  }
]

const ResourcesLayout = () => {
  const [selectedElement, setSelectedElement] = useState()



  return ( <Box display="flex" >
    
    {/* <NestedSidebar elements={sidebarElements} selectedElement={selectedElement} onSelect={setSelectedElement} /> */}

    <Recources />


  </Box> );
}
 
export default ResourcesLayout;