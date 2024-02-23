import { Loader } from "@googlemaps/js-api-loader"



export default function FetchMap(){
let map: google.maps.Map;

const loader = new Loader({
    apiKey: "AIzaSyDClPR5i3HMbYZGeUsKJGB39n-433oKQ-A",
    version: "weekly",
  });
  
loader.load().then(async () => {
    const { Map } =  await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  });


}