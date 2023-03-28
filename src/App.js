/* map */
import MapComp from "./components/MapComp";

export default function App() {

  return (
    <div>   
      <h1 className="heading">
        Mapbox Map to Babylon.js 3D cuboid
      </h1>
      <MapComp />
      <footer style={{textAlign:'center'}}>
        <span style={{color:'white'}}>Designed by Rohan Hulsure ❤</span>
      </footer>
    </div>
  );
}
