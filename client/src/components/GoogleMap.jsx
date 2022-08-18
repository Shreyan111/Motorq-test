import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MdLocationOn } from 'react-icons/md';

const AnyReactComponent = () => <MdLocationOn className="text-megenta-400 text-4xl"/>;

const SimpleMap = ({location})=>{
  
  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  
  const center= {
    lat: location.latitude,
    lng: location.longitude
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBjOvIs8J5OiZrzsiOiN42Z3jKfZH1K71Q"
  })


  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, []);


  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

    // return (
    //   // Important! Always set the container height explicitly
    //   <div style={{ height: '100%', width: '100%' }}>
    //     <GoogleMapReact
    //       bootstrapURLKeys={{ key: "AIzaSyBjOvIs8J5OiZrzsiOiN42Z3jKfZH1K71Q" }}
    //       defaultCenter={defaultProps.center}
    //       defaultZoom={defaultProps.zoom}
    //     >
    //       <AnyReactComponent
    //         lat={defaultProps.center.lat}
    //         lng={defaultProps.center.lng}
    //         text="My Marker"
    //       />
    //     </GoogleMapReact>
    //   </div>
    // );
    return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <><AnyReactComponent/></>
      </GoogleMap>
  ) : <></>
 
}

export default SimpleMap;