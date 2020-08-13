import React from "react";
import { observable, action, computed } from "mobx";
import { observer, inject, useLocalStore } from "mobx-react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import "./gdmap.scss";
import { Modal, SlotModal, Toast } from "../../components";
import { forEach, get } from "lodash";
import Service from "../../services/coursesService";
import { View } from "antd-mobile";
const service = new Service();
import { Map, Marker } from "react-amap";

class Gdmap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 设置坐标点，就会在地图上显示一个 标记点
      markerPosition: { longitude: 120, latitude: 35 },
      gdkey: "4a5fd3d3bffd17df6b0db8d31e0f56f9",
      address: "",
      lnglat: "",
      geocoder: null,
    };
    // 高德地图 Marker 实例
    this.markerInstance = undefined;
    // 高德地图 Map 实例
    this.mapInstance = undefined;

    this.amapEvents = {
      created: (mapInstance) => {
        console.log(
          "高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如："
        );
        console.log("缩放级别：", mapInstance.getZoom());
        this.mapInstance = mapInstance;

        AMap.plugin(
          ["AMap.Autocomplete", "AMap.PlaceSearch", "AMap.CitySearch"],
          () => {
            // 实例化Autocomplete
            const autoOptions = {
              // city 限定城市，默认全国
              // city: '025',
              // input 为绑定输入提示功能的input的DOM ID
              input: "amapInput",
            };
            const autoComplete = new AMap.Autocomplete(autoOptions);
            // 无需再手动执行search方法，autoComplete会根据传入input对应的DOM动态触发search

            const placeSearch = new AMap.PlaceSearch({
              // city: '南京',
              map: mapInstance,
            });

            // 监听下拉框选中事件
            AMap.event.addListener(autoComplete, "select", (e) => {
              // TODO 针对选中的poi实现自己的功能
              placeSearch.setCity(e.poi.adcode);
              placeSearch.search(e.poi.name);
              console.log(e.poi.location.lat, e.poi.location.lng);
              this.setState({
                lnglat: e.poi.location.lat + "," + e.poi.location.lng,
              });
            });

            const citySearch = new AMap.CitySearch();
            citySearch.getLocalCity((status, result) => {
              if (status === "complete" && result.info === "OK") {
                // 查询成功，result即为当前所在城市信息
                console.log("当前所在城市：", result);
                if (result && result.city && result.bounds) {
                  // 当前城市名称
                  // const cityinfo = result.city;

                  // 当前城市位置信息
                  const citybounds = result.bounds;
                  // document.getElementById('info').innerHTML = '您当前所在城市：'+cityinfo;
                  // 地图显示当前城市
                  mapInstance.setBounds(citybounds);
                  // 需要在设置坐标成功后，重新设置 缩放级别
                  // mapInstance.setZoom(15)
                }
              }
            });
          }
        );

        // 实例点击事件
        // mapInstance.on("click", (e) => {
        //   const lngLat = `${e.lnglat.getLat()},${e.lnglat.getLng()}`;
        //   console.log("坐标位置:", lngLat);
        //   this.props.onChange(lngLat);
        // });
      },
    };
    this.markerEvents = {
      created: (markerInstance) => {
        console.log(
          "高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如："
        );
        console.log(markerInstance.getPosition());

        this.markerInstance = markerInstance;
      },
    };
    // this.markerPosition = { longitude: 120, latitude: 30 };
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (this.props.value !== prevProps.value) {
      if (value) {
        const temp = value.split(",");

        // 重新设置地图坐标点
        this.setState(
          { markerPosition: { longitude: temp[1], latitude: temp[0] } },
          () => {
            // 需要在设置坐标成功后，重新设置 缩放级别
            if (this.mapInstance) {
              this.mapInstance.setZoom(15);
            }
          }
        );
      }
    }
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        {/* zoom={15} 设置后，无效，不知道什么原因，必须手动设置 */}
        <Map
          className="gdmap"
          events={this.amapEvents}
          amapkey={this.state.gdkey}
          center={this.state.markerPosition}
        >
          <Marker
            position={this.state.markerPosition}
            events={this.markerEvents}
          />
        </Map>
        {
          <div className="input-card">
            <label>地理编码，根据地址获取经纬度坐标</label>
            <div className="input-item">
              <div className="input-item-prepend">
                <span className="input-item-text">地址</span>
              </div>
              <input
                id="amapInput"
                type="text"
                placeholder="请输入地址"
                onInput={(e) => {
                  this.setState({ address: e.target.value });
                }}
              />
            </div>
            <div className="input-item">
              <div className="input-item-prepend">
                <span className="input-item-text">经纬度</span>
              </div>
              <input
                id="lnglat"
                disabled
                type="text"
                defaultValue={this.state.lnglat}
              />
            </div>
            <input
              id="geo"
              type="button"
              className="btn"
              defaultValue="地址 -> 经纬度"
            />
          </div>
          // <div className={styles.infoBox}>
          //   <span className={styles.inputText}>请输入关键字</span>
          //   <input id="amapInput" className={styles.input} type="text" />
          // </div>
        }
      </div>
    );
  }
}

export default Gdmap;
