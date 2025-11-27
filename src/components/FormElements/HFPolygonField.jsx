import React, {useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {Controller} from "react-hook-form";
import {FullscreenControl, Map, Polygon, YMaps} from "@pbe/react-yandex-maps";
import {isJSONParsable} from "../../utils/isJsonValid";

const HFPolygonField = ({
  control,
  name,
  tabIndex,
  required,
  updateObject,
  isNewTableView = false,
  rules,
  disabledHelperText = false,
  disabled,
  field,
  defaultPolygon = [],
  polygons = [],
  width = 0,
  height = 0,
  ...props
}) => {
  const mapRef = useRef();
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: field?.attributes?.lat || "41.2995",
    long: field?.attributes?.long || "69.2401",
  });

  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(0);
  const [editingPolygon, setEditingPolygon] = useState(false);

  useEffect(() => {
    const handleGeolocationError = (error) => {
      console.error("Error getting current location:", error);
    };

    const handleGeolocationSuccess = (position) => {
      const {latitude, longitude} = position.coords;
      setSelectedCoordinates({lat: latitude, long: longitude});
    };

    const getCurrentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          handleGeolocationSuccess,
          handleGeolocationError
        );
      } else {
        console.error("Geolocation is not supported in this browser.");
      }
    };

    getCurrentLocation();
  }, []);

  const handlePolygonSwitch = (index) => {
    setSelectedPolygonIndex(index);
  };

  const [selectedVertexIndex, setSelectedVertexIndex] = useState(null);

  const handleVertexClick = (index) => {
    setSelectedVertexIndex(index);
    setEditingPolygon(true);
  };

  const draw = (ref) => {
    ref?.editor?.startDrawing();
    ref?.editor?.events?.add("vertexadd", (event) => {
      console.log(event);
    });
  };

  const mapState = {
    center: [selectedCoordinates?.lat, selectedCoordinates?.long],
    zoom: 9,
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultPolygon}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        const parsedPolygon = isJSONParsable(value) ? JSON.parse(value) : {};
        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}>
            <YMaps
              query={{
                load: "package.full",
                apikey: "5e5a73bd-6e0a-40f1-ba8e-f0b98d95e75f",
              }}>
              <Map
                width={width !== 0 ? width : "265px"}
                height={height !== 0 ? height : "200px"}
                defaultState={mapState}
                modules={["geoObject.addon.editor"]}>
                <Polygon
                  editingPolygon={true}
                  onGeometryChange={(event) => {
                    const coordinates =
                      event?.originalEvent?.target?.geometry?._coordPath
                        ?._coordinates;
                    if (coordinates) {
                      const coordinatesJson = JSON.stringify(coordinates);

                      onChange(coordinatesJson);
                    }
                  }}
                  instanceRef={(ref) =>
                    !window?.location.pathname?.includes("constructor/apps")
                      ? ref && draw(ref)
                      : draw({})
                  }
                  geometry={parsedPolygon}
                  options={{
                    editorDrawingCursor: "crosshair",
                    editorMaxPoints: 25,
                    fillColor: "rgba(222,109,110, 0.5)",
                    strokeColor: "rgb(69,130,250)",
                    strokeWidth: 3,
                    editable: true,
                  }}
                />
              </Map>
            </YMaps>
          </Box>
        );
      }}
    />
  );
};

export default HFPolygonField;
