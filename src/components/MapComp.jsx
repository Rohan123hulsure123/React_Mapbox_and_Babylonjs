import React, { useRef, useEffect, useState, forwardRef } from "react";
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useScreenshot } from "use-react-screenshot";
import Cuboid from "./Cuboid";

/* map */
mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9uZG9uZG9uMTIzIiwiYSI6ImNsZmI5NmF5OTA4OHozeHBnMGY0ZGV5d28ifQ.mLr_v5Gqv-FHOnV8nk2Opg";

const MapComp = forwardRef(() => {
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
        zoom: 8,
      });

      
    });
  });

  return (
    <Container fluid>
      <Row>
        <Col md='6' style={{paddingLeft:'2%', paddingRight:'1%', paddingTop:'2%', paddingBottom:'0'}}>
          {/**Map box */}
          <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
          <div ref={mapContainer} className="map-container" />
        </Col>
        <Col md='6' style={{paddingRight:'2%',paddingLeft:'1%', paddingTop:'2%', paddingBottom:'0'}}>
            {/* Babylon js cuboid */}
            <Cuboid image={image}/> 
        </Col>
      </Row>
      <div style={{display: 'flex', justifyContent: 'center', marginTop:'1%', marginBottom:'1%'}}>
          <Button onClick={getImage} md="2" style={{width:'20vw'}} variant="dark">
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
