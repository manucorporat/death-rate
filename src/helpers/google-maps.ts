import { Coord } from "./model";

export function setGoogleMaps(mapEle: HTMLElement, coord: Coord) {
  requestAnimationFrame(async () => {
    const googleMaps = await getGoogleMaps('AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw');
    new googleMaps.Map(mapEle, {
      zoom: 15,
      disableDefaultUI: true,
      center: {lat: coord.angle, lng:coord.log},
      styles: [
        {
            "stylers": [
                {
                    "hue": "#B61530"
                },
                {
                    "saturation": 60
                },
                {
                    "lightness": -40
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "color": "#B61530"
                }
            ]
        },
        {
            "featureType": "road",
            "stylers": [
                {
                    "color": "#B61530"
                },
                {}
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "color": "#B61530"
                },
                {
                    "lightness": 6
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "color": "#B61530"
                },
                {
                    "lightness": -25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "color": "#B61530"
                },
                {
                    "lightness": -10
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "color": "#B61530"
                },
                {
                    "lightness": 70
                }
            ]
        },
        {
            "featureType": "transit.line",
            "stylers": [
                {
                    "color": "#B61530"
                },
                {
                    "lightness": 90
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        }
    ]
    });
  });
}


export function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const google = win.google;
  if (google && google.maps) {
    return Promise.resolve(google.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      const win = window as any;
      const google = win.google;
      if (google && google.maps) {
        resolve(google.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}
