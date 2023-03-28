import React, { useRef, useEffect, useState } from "react";
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useScreenshot } from "use-react-screenshot";
import Cuboid from "./Cuboid";

/* map */
mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9uZG9uZG9uMTIzIiwiYSI6ImNsZmI5NmF5OTA4OHozeHBnMGY0ZGV5d28ifQ.mLr_v5Gqv-FHOnV8nk2Opg";

const MapComp = (() => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(79.1014);
  const [lat, setLat] = useState(20.3563);
  const [zoom, setZoom] = useState(2.5);
  const [isLoading, setLoading] = useState("visually-hidden");

  //screenshot logic
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => {
    takeScreenshot(mapContainer.current);
    setLoading("visible");
    setTimeout(() => {
      setLoading("visually-hidden");
    }, 3000);
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
      preserveDrawingBuffer: true,
    });
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      })
    ); // add's zoom and rotate buttons to map
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("click", (e) => {
      new mapboxgl.Marker({})
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current);

      // map.current.zoomTo(6, { duration: 9000 });
      map.current.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
        zoom: (map.current.getZoom()>8)?map.current.getZoom():8,
      });
    });
  });

  return (
    <Container fluid>
      <Row>
        {/**Map box */}
        <Col md='6' className="container-parent">
          <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
          <div ref={mapContainer} className="map-container" />
        </Col>
        {/* Babylon js cuboid */}
        <Col md='6' className="container-parent" >
            <Cuboid image={image}/> 
        </Col>
      </Row>
      <div style={{display: 'flex', justifyContent: 'center',marginBottom:'1%'}}>
          <Button onClick={getImage} md="2" className="screenshot-button" variant="dark">
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              style={{marginRight:'2%'}}
              className={isLoading}
            />
              <span>Take screenshot</span>
          </Button>
      </div>
    </Container>
  );
});

export default MapComp;
