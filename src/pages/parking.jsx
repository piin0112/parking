import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { myPositionActions, parkingActions } from "../store/store";

// 你自己的元件
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import Information from "../components/Information";
import Position from "../components/Position";
import IsLoaded from "../components/IsLoaded";

// 你需要的工具或常數
import mapStyles from "../helpers/mapStyles";
import centerLatLngOfDistrict from "../helpers/centerLatLngOfDistrict";
import key from "../key";

// Marker 圖示
import markerIcon from "../assets/images/marker.svg";
import markerZeroIcon from "../assets/images/markerZero.svg";
import clickedMarkerZero from "../assets/images/clickedMarkerZero.svg";

const libraries = ["places"];

function Parking() {
  const dispatch = useDispatch();

  // 新增一個 state 來存放使用者位置的座標
  const [userLatLng, setUserLatLng] = useState(null);

  const [map, setMap] = useState(null);
  const [data, setData] = useState([]);
  const [center, setCenter] = useState({ lat: 22.9999, lng: 120.227 }); // 台南市中心

  // Redux 狀態
  const myPosition = useSelector((state) => state.myPosition.myPosition);  // 是否觸發「回到定位」
  const info = useSelector((state) => state.parking.info);                // 目前點擊的停車場資訊
  const dataId = useSelector((state) => state.parking.dataId);            // 目前點擊的停車場 ID
  const district = useSelector((state) => state.filter.district);         // 行政區
  const showFilter = useSelector((state) => state.filter.showFilter);     // 是否顯示 Filter
  const searchLatLng = useSelector((state) => state.search.searchLatLng); // 搜尋列輸入後得到的座標

  // Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: key(),
    libraries,
    language: "zh-TW",
    region: "TW",
  });

  // 一進來就從 /public/parking.json 載入資料
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch(
          "https://piin0112.github.io/parking/parking.json"
        );
        const parkingData = await response.json();
        const parsedData = parkingData.map((item) => ({
          ...item,
          LatLng: {
            lat: parseFloat(item.lnglat.split(",")[0]),
            lng: parseFloat(item.lnglat.split(",")[1]),
          },
        }));
        setData(parsedData);
      } catch (error) {
        console.error("載入停車場資料失敗", error);
      }
    };
    fetchParkingData();
  }, []);

  // 切換行政區時
  useEffect(() => {
    if (!map) return;
    if (district) {
      const found = centerLatLngOfDistrict.find((d) => d.district === district);
      if (found) {
        map.panTo({ lat: found.lat, lng: found.lng });
      }
    }
  }, [district, map]);

  // 地圖拖曳結束更新中心
  const handleDragEnd = useCallback(() => {
    if (!map) return;
    const newCenter = map.getCenter();
    if (!newCenter) return;
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    setCenter({ lat, lng });
  }, [map]);

  // 定位使用者位置 (更新 userLatLng 並移動地圖)
  useEffect(() => {
    if (myPosition && map) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentLatLng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          // 將座標存到 state，並將地圖中心移到該座標
          setUserLatLng(currentLatLng);
          map.panTo(currentLatLng);
          setCenter(currentLatLng);
        },
        (err) => {
          console.error("取得使用者位置失敗", err);
        }
      );
      dispatch(myPositionActions.notMyPosition());
    }
  }, [myPosition, map, dispatch]);

  // 搜尋功能移動地圖
  useEffect(() => {
    if (!map) return;
    if (searchLatLng && searchLatLng.lat && searchLatLng.lng) {
      map.panTo(searchLatLng);
      setCenter(searchLatLng);
    }
  }, [searchLatLng, map]);

  // 點擊標記移動地圖
  useEffect(() => {
    if (!map || !dataId) return;
    const target = data.find((item) => item.id === dataId);
    if (target) {
      dispatch(parkingActions.getInfo(target));
      map.panTo(target.LatLng);
    }
  }, [dataId, data, map, dispatch]);

  // 若尚未載入完成，顯示 Loading 畫面
  if (!isLoaded) {
    return <IsLoaded />;
  }

  return (
    <div className="park">
      {!info?.id && <Position />}
      {showFilter && <Filter />}
      <SearchBar />
      {info?.id && <Information data={info} />}

      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        mapContainerClassName="map-container"
        options={{
          styles: mapStyles,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy", // 允許直接用滑鼠滾輪縮放
        }}
        
        onLoad={(mapInstance) => setMap(mapInstance)}
        onDragEnd={handleDragEnd}
      >
        
        {/* 使用者位置 Marker */}
        {userLatLng && (
          <Marker
            position={userLatLng}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // 預設藍色 Marker
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {/* 停車場 Marker */}
        {data.map((park) => {
          if (info?.id === park.id) {
            return (
              <Marker
                key={park.id}
                position={park.LatLng}
                icon={{
                  url: park.car > 0 ? clickedMarkerZero : clickedMarkerZero,
                }}
                label={String(park.car || 0)}
                onClick={() => dispatch(parkingActions.getDataId(park.id))}
              />
            );
          }
          return (
            <Marker
              key={park.id}
              position={park.LatLng}
              icon={{
                url: park.car > 0 ? markerIcon : markerZeroIcon,
              }}
              label={String(park.car || 0)}
              onClick={() => dispatch(parkingActions.getDataId(park.id))}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}

export default Parking;
