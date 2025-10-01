/* global kakao */
import React, { useEffect, useRef, useState } from 'react';

const KakaoMapComponent = ({ parkingLots, initialCenter, newCenter, addFavorite }) => {
  const OCCUPANCY_RATE_FULL = 100;
  const OCCUPANCY_RATE_HIGH_MIN = 90;
  const OCCUPANCY_RATE_MEDIUM_MIN = 60;

  const mapRef = useRef(null);
  const currentInfowindow = useRef(null);
  const [roadviewLot, setRoadviewLot] = useState(null);
  const [isRoadviewExpanded, setIsRoadviewExpanded] = useState(false);
  const markerClickInProgress = useRef(false);
  const [mapType, setMapType] = useState('ROADMAP');
  const [userMarker, setUserMarker] = useState(null);
  const [heading, setHeading] = useState(0); // For device orientation
  const [routeLine, setRouteLine] = useState(null);
  const routePathRef = useRef([]); // To store the full route from the API

  // Function to clear existing route
  const clearRoute = () => {
    if (routeLine) {
      routeLine.setMap(null);
    }
  };

  // Function to draw route
  const drawRoute = (path) => {
    clearRoute();

    // Draw the main polyline
    const polyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 5,
      strokeColor: '#1E90FF',
      strokeOpacity: 0.9,
      strokeStyle: 'dash'
    });
    polyline.setMap(mapRef.current);
    setRouteLine(polyline);
  };





  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const mapScript = () => {
      const container = document.getElementById('kakao-map');
      const map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(initialCenter[0], initialCenter[1]),
        level: 3,
      });
      mapRef.current = map;

      if (newCenter) {
        map.setCenter(new kakao.maps.LatLng(newCenter[0], newCenter[1]));
        map.setLevel(2);
      }

      kakao.maps.event.addListener(map, 'click', () => {
        if (markerClickInProgress.current) return;

        if (currentInfowindow.current) {
          currentInfowindow.current.close();
          currentInfowindow.current = null;
        }
        setRoadviewLot(null);
      });

      const createParkingMarker = (status) => {
        let color;
        switch (status) {
          case 'full': color = '#F44336'; break;
          case 'high': color = '#FF9800'; break;
          case 'medium': color = '#4CAF50'; break;
          case 'low':
          default: color = '#2196F3'; break;
        }

        const svg = `
          <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0 C7.5 0 0 7.5 0 15 C0 25 15 45 15 45 C15 45 30 25 30 15 C30 7.5 22.5 0 15 0 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text x="15" y="17" font-size="16" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-weight="bold" dominant-baseline="middle">P</text>
          </svg>
        `;

        return new kakao.maps.MarkerImage(
          `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
          new kakao.maps.Size(30, 45),
          { offset: new kakao.maps.Point(15, 45) }
        );
      };

      parkingLots.forEach((lot) => {
        const position = new kakao.maps.LatLng(lot.position[0], lot.position[1]);
        const occupancy = (lot.occupied / lot.total) * 100;
        let status;
        if (occupancy === OCCUPANCY_RATE_FULL) {
          status = 'full'; // 100%
        } else if (occupancy >= OCCUPANCY_RATE_HIGH_MIN && occupancy < OCCUPANCY_RATE_FULL) {
          status = 'high'; // 90% to <100%
        } else if (occupancy >= OCCUPANCY_RATE_MEDIUM_MIN && occupancy < OCCUPANCY_RATE_HIGH_MIN) {
          status = 'medium'; // 60% to <90%
        } else {
          status = 'low'; // <60%
        }

        const marker = new kakao.maps.Marker({
          map,
          position,
          image: createParkingMarker(status),
        });

        const contentDiv = document.createElement('div');
        contentDiv.style.padding = '10px';
        contentDiv.style.minWidth = '150px';
        contentDiv.style.textAlign = 'center';
        contentDiv.style.fontWeight = 'bold';
        contentDiv.style.borderRadius = '8px';
        contentDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        contentDiv.style.backgroundColor = '#fff';

        const name = document.createElement('p');
        name.textContent = lot.name;
        name.style.margin = '0 0 5px 0';
        name.style.color = '#0056b3';
        contentDiv.appendChild(name);

        const statusText = document.createElement('p');
        statusText.textContent = `${status === 'full' ? '만차' : status === 'high' ? '혼잡' : status === 'medium' ? '보통' : '여유'} (${lot.occupied} / ${lot.total})`;
        statusText.style.color = status === 'full' ? '#F44336' : status === 'high' ? '#FF9800' : status === 'medium' ? '#4CAF50' : '#2196F3';
        contentDiv.appendChild(statusText);

        const addButton = document.createElement('button');
        addButton.textContent = '즐겨찾기 추가';
        addButton.style.width = '100%';
        addButton.style.padding = '8px';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '6px';
        addButton.style.backgroundColor = '#4CAF50';
        addButton.style.color = '#fff';
        addButton.style.cursor = 'pointer';
        addButton.addEventListener('click', () => {
          addFavorite(lot);
          infowindow.close();
          currentInfowindow.current = null;
        });
        contentDiv.appendChild(addButton);

        const infowindow = new kakao.maps.InfoWindow({
          content: contentDiv,
          removable: false,
        });

        kakao.maps.event.addListener(marker, 'click', () => {
          markerClickInProgress.current = true;

          if (currentInfowindow.current) currentInfowindow.current.close();
          infowindow.open(map, marker);
          currentInfowindow.current = infowindow;

          if (lot.name && lot.name.includes('야외')) {
            setRoadviewLot(lot);
            setIsRoadviewExpanded(false);
          } else {
            setRoadviewLot(null);
          }

          setTimeout(() => {
            markerClickInProgress.current = false;
          }, 0);
        });
      });
    };

    kakao.maps.load(mapScript);
  }, [parkingLots, initialCenter, newCenter, addFavorite, OCCUPANCY_RATE_FULL, OCCUPANCY_RATE_HIGH_MIN, OCCUPANCY_RATE_MEDIUM_MIN]);

  useEffect(() => {
    if (!mapRef.current) return;

    let watchId;
    const KAKAO_REST_API_KEY = '9adc2aa02eabd3ccc0e2b4afeaf5faaf';
    const DANKOOK_UNIV_POSITION = { lat: 37.32190, lng: 127.12663 };

    const getRoute = async (origin, destination) => {
      try {
        const response = await fetch(
          `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin.lng},${origin.lat}&destination=${destination.lng},${destination.lat}`,
          {
            headers: {
              Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const sections = data.routes[0].sections;
          const path = sections.flatMap(section =>
            section.roads.flatMap(road => {
              const vertexes = road.vertexes;
              const pathSegment = [];
              for (let i = 0; i < vertexes.length; i += 2) {
                pathSegment.push(new kakao.maps.LatLng(vertexes[i+1], vertexes[i]));
              }
              return pathSegment;
            })
          );
          routePathRef.current = path;
          drawRoute(path);
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = new kakao.maps.LatLng(latitude, longitude);
          const map = mapRef.current;

          if (!userMarker) {
            const userMarkerSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-12 -12 24 24">
                <g transform="rotate(0)">
                  <path d="M0 -10 L8 10 L0 5 L-8 10 Z" fill="#007bff" stroke="white" stroke-width="1.5"/>
                </g>
              </svg>
            `;
            const userMarkerImage = new kakao.maps.MarkerImage(
              `data:image/svg+xml;utf8,${encodeURIComponent(userMarkerSvg)}`,
              new kakao.maps.Size(24, 24),
              { offset: new kakao.maps.Point(12, 12) }
            );
            map.setCenter(newPosition);
            const marker = new kakao.maps.Marker({ position: newPosition, map: map, image: userMarkerImage });
            setUserMarker(marker);
            getRoute({ lat: latitude, lng: longitude }, DANKOOK_UNIV_POSITION);
          } else {
            userMarker.setPosition(newPosition);

            if (routeLine && routePathRef.current.length > 0) {
              let closestIndex = -1;
              let minDistance = Infinity;

              routePathRef.current.forEach((point, index) => {
                const dist = Math.sqrt(Math.pow(point.getLat() - latitude, 2) + Math.pow(point.getLng() - longitude, 2));
                if (dist < minDistance) {
                  minDistance = dist;
                  closestIndex = index;
                }
              });

              if (closestIndex !== -1) {
                const newPath = [newPosition, ...routePathRef.current.slice(closestIndex)];
                drawRoute(newPath);
              }
            }
          }
        },
        (error) => { console.error("Geolocation error: ", error); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    let lastHeading = 0;
    const handleOrientation = (event) => {
      const alpha = event.webkitCompassHeading || event.alpha;
      if (typeof alpha === 'number') {
        const smoothingFactor = 0.1;
        const delta = alpha - lastHeading;
        const shortestAngle = ((delta + 180) % 360) - 180;
        const newHeading = (lastHeading + smoothingFactor * shortestAngle + 360) % 360;
        lastHeading = newHeading;
        setHeading(newHeading);
      }
    };

    const startOrientationListener = () => {
      if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation, true);
              }
            })
            .catch(console.error);
        } else {
          window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        }
      }
    };

    startOrientationListener();

    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, [userMarker]); 

  useEffect(() => {
    if (!userMarker) return;

    const userMarkerSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-12 -12 24 24">
        <g transform="rotate(${heading})">
          <path d="M0 -10 L8 10 L0 5 L-8 10 Z" fill="#007bff" stroke="white" stroke-width="1.5"/>
        </g>
      </svg>
    `;

    const userMarkerImage = new kakao.maps.MarkerImage(
      `data:image/svg+xml;utf8,${encodeURIComponent(userMarkerSvg)}`,
      new kakao.maps.Size(24, 24),
      { offset: new kakao.maps.Point(12, 12) }
    );

    userMarker.setImage(userMarkerImage);
  }, [heading, userMarker]);

  useEffect(() => {
    if (!mapRef.current) return;
    const maptypeId = mapType === 'HYBRID' ? kakao.maps.MapTypeId.HYBRID : kakao.maps.MapTypeId.ROADMAP;
    mapRef.current.setMapTypeId(maptypeId);
  }, [mapType]);

  useEffect(() => {
    const roadviewContainer = document.getElementById('roadview');
    if (roadviewLot && roadviewContainer) {
        roadviewContainer.innerHTML = '';
        const position = new kakao.maps.LatLng(roadviewLot.position[0], roadviewLot.position[1]);
        const roadview = new kakao.maps.Roadview(roadviewContainer);
        const roadviewClient = new kakao.maps.RoadviewClient();

        roadviewClient.getNearestPanoId(position, 50, (panoId) => {
            if (panoId) {
                roadview.setPanoId(panoId, position);
            } else {
                roadviewContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: black;">로드뷰 정보가 없습니다.</div>';
            }
        });
    }
  }, [roadviewLot, isRoadviewExpanded]);

  const buttonStyle = (type) => ({
    padding: '5px 10px',
    border: '1px solid #ccc',
    backgroundColor: mapType === type ? '#333' : 'white',
    color: mapType === type ? 'white' : 'black',
    cursor: 'pointer'
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div id="kakao-map" style={{ width: '100%', height: '100%' }} />

      {/* Custom MapType Control */}
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '10px',
        zIndex: 10,
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}>
          <button onClick={() => setMapType('ROADMAP')} style={{...buttonStyle('ROADMAP'), borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'}}>지도</button>
          <button onClick={() => setMapType('HYBRID')} style={{...buttonStyle('HYBRID'), borderTopRightRadius: '5px', borderBottomRightRadius: '5px'}}>스카이뷰</button>
      </div>

      {/* Zoom and Legend Controls */}
      <div style={{
        position: 'absolute',
        top: '150px',
        right: '10px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div onClick={() => mapRef.current && mapRef.current.setLevel(mapRef.current.getLevel() - 1)} style={{ padding: '5px 8px', cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', lineHeight: '1' }}>+</span>
          </div>
          <div onClick={() => mapRef.current && mapRef.current.setLevel(mapRef.current.getLevel() + 1)} style={{ padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', lineHeight: '1' }}>-</span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '12px',
            height: '60px',
            borderRadius: '3px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            marginRight: '5px'
          }}>
            <div style={{ flex: 1, backgroundColor: '#F44336' }}></div>
            <div style={{ flex: 1, backgroundColor: '#FF9800' }}></div>
            <div style={{ flex: 1, backgroundColor: '#4CAF50' }}></div>
            <div style={{ flex: 1, backgroundColor: '#2196F3' }}></div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '60px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            <span>만차</span>
            <span>혼잡</span>
            <span>보통</span>
            <span>여유</span>
          </div>
        </div>
      </div>

      {roadviewLot && (
          <div
              id="roadview-wrapper"
              style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  width: isRoadviewExpanded ? '400px' : '150px',
                  height: isRoadviewExpanded ? '300px' : '100px',
                  zIndex: 11,
                  cursor: isRoadviewExpanded ? 'default' : 'pointer',
                  transition: 'width 0.3s, height 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  border: '1px solid #ccc',
                  backgroundColor: 'white'
              }}
              onClick={() => {
                  if (!isRoadviewExpanded) {
                      setIsRoadviewExpanded(true);
                  }
              }}
          >
              <div id="roadview" style={{ width: '100%', height: '100%' }}></div>
              {isRoadviewExpanded && (
                  <div
                      id="roadview-close-btn"
                      style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          cursor: 'pointer',
                          zIndex: 12,
                          color: 'black',
                          backgroundColor: 'white',
                          padding: '2px 5px',
                          borderRadius: '50%',
                          fontWeight: 'bold',
                          boxShadow: '0 0 3px black'
                      }}
                      onClick={(e) => {
                          e.stopPropagation();
                          setIsRoadviewExpanded(false);
                          setRoadviewLot(null);
                      }}
                  >
                      X
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default KakaoMapComponent;