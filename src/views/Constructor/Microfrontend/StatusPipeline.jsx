import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import { Box } from '@mui/material';
import React, { useMemo, useState } from 'react';
import ErrorStatusModal from './ErrorStatusModal';

export default function StatusPipeline({ element }) {
  const iconStyle = {
    width: "16px",
    height: "16px",
    backgroundColor: element?.pipeline_status === "success" ? "#108548" : element?.pipeline_status === "failed" ? "#ae1800" : element?.pipeline_status === "running" ? "#8f4700" : element?.pipeline_status === "skipped" ? "#535158" : "#535158",
    color: "#FFF",
    borderRadius: "50%",
  }

  const statusGenerator = useMemo(() => {
    if (element?.pipeline_status === "success") {
      return {
        icon: <DoneRoundedIcon style={iconStyle} />,
        text: "Success",
        boxColor: "#24663b",
        boxBackgroundColor: "#c3e6cd"
      }
    } else if (element?.pipeline_status === "failed") {
      return {
        icon: <ClearRoundedIcon style={iconStyle} />,
        text: "Failed",
        boxColor: "#ae1800",
        boxBackgroundColor: "#fdd4cd"
      }
    } else if (element?.pipeline_status === "running") {
      return {
        icon: <DonutLargeRoundedIcon style={iconStyle} />,
        text: "In process",
        boxColor: "#8f4700",
        boxBackgroundColor: "#f5d9a8"
      }
    } else if (element?.pipeline_status === "skipped") {
      return {
        icon: <SkipNextRoundedIcon style={iconStyle} />,
        text: "Skipped",
        boxColor: "#535158",
        boxBackgroundColor: "#dcdcde"
      }
    }
  }, [element])

  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{
      backgroundColor: statusGenerator?.boxBackgroundColor,
      color: statusGenerator?.boxColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '4px',
      borderRadius: '10rem',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1rem',
      width: "max-content"
    }}
      onClick={(e) => {
        e.stopPropagation();
        if (element?.pipeline_status === "failed") {
          setOpenModal(true);
        }
      }}
    >
      {statusGenerator?.icon}
      <span style={{
        paddingLeft: '0.25rem',
        paddingRight: '0.25rem',
      }}>
        {statusGenerator?.text}
      </span>

      {openModal && <ErrorStatusModal setOpenModal={setOpenModal} element={element} />}
    </Box>
  )
}
