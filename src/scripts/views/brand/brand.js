import React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { NavBar, SearchBar, WhiteSpace, List, Icon } from "antd-mobile";
import "./brand.scss";
import Service from "../../services/coursesService";
const service = new Service();
import axios from "axios";
import apiConf from "../../config/api";
import { Toast, IndexNav, Indicator, PositionCity } from "../../components";
import { forEach, get } from "lodash";
const Item = List.Item;

@inject("rootStore")
@observer
class Brand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localCity: "北京",
      city: {
        A: [
          { city: "鞍山", en: "anshan", id: 1, pid: "10107" },
          { city: "安徽", en: "anhui", id: 2, pid: "10107" },
          { city: "阿里", en: "ali", id: 3, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 11, pid: "10107" },
          { city: "安徽", en: "anhui", id: 12, pid: "10107" },
          { city: "阿里", en: "ali", id: 13, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 21, pid: "10107" },
          { city: "安徽", en: "anhui", id: 22, pid: "10107" },
          { city: "阿里", en: "ali", id: 23, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 31, pid: "10107" },
          { city: "安徽", en: "anhui", id: 32, pid: "10107" },
          { city: "阿里", en: "ali", id: 33, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 41, pid: "10107" },
          { city: "安徽", en: "anhui", id: 42, pid: "10107" },
          { city: "阿里", en: "ali", id: 43, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 51, pid: "10107" },
          { city: "安徽", en: "anhui", id: 52, pid: "10107" },
          { city: "阿里", en: "ali", id: 53, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 61, pid: "10107" },
          { city: "安徽", en: "anhui", id: 62, pid: "10107" },
          { city: "阿里", en: "ali", id: 63, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 71, pid: "10107" },
          { city: "安徽", en: "anhui", id: 72, pid: "10107" },
          { city: "阿里", en: "ali", id: 73, pid: "10107" },
          { city: "鞍山", en: "anshan", id: 81, pid: "10107" },
          { city: "安徽", en: "anhui", id: 82, pid: "10107" },
          { city: "阿里", en: "ali", id: 83, pid: "10107" },
        ],
        B: [
          { city: "北京", en: "beijing", id: 4, pid: "10107" },
          { city: "北山", en: "beishan", id: 5, pid: "10107" },
          { city: "北国", en: "beiguo", id: 6, pid: "10107" },
        ],
      },
      brandList: {},
      labels: ["A", "B", "C"],
      moving: false,
      indicator: "",
      loading: false,
      searchArea: false,
    };
  }

  componentDidMount = () => {
    this.getBrand();
  };
  //  union_c5be982a939694d919596dd83f8f484c
  getBrand = () => {
    service
      .getBrand({})
      .then((res) => {
        console.log(res);
        this.setState({
          brandList: res.data.brandList,
        });
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
      });
  };

  renderCities = () => {
    const { brandList } = this.state;
    return Object.keys(brandList).map((letter) => {
      const cList = brandList[letter];
      return (
        <div
          key={letter}
          ref={(element) => (this[`section${letter}`] = element)}
        >
          <List renderHeader={() => letter}>
            {cList.length > 0 &&
              cList.map((c) => {
                return (
                  <Item
                    arrow="horizontal"
                    className="city-list-item"
                    key={c.id}
                    onClick={() => this.onSelectCity(c)}
                  >
                    <img src={c.logo} />
                    {c.brandName}
                  </Item>
                );
              })}
          </List>
        </div>
      );
    });
  };

  onSelectCity = (brand) => {
    if (this.state.moving) {
      return;
    }
    console.log(brand);
    localStorage.setItem("brandChannel", brand.id);
    localStorage.setItem("brandName", brand.brandName);
    this.props.history.push("/company");
  };

  onNavChange = (nav) => {
    this.setState(() => {
      const label = nav.label ? nav.label : this.state.label;
      const moving = nav.moving ? nav.moving : this.state.moving;
      this[`section${label}`] && this[`section${label}`].scrollIntoView();
      return {
        moving,
        indicator: label,
      };
    });
  };

  render() {
    const { labels, indicator, moving, loading } = this.state;

    if (loading) {
      return null;
    }

    return (
      <div className="city">
        <div className="city-list">
          <div className="city-list-content">
            {this.renderCities()}
            <Indicator indicator={indicator} />
          </div>
          <div className="city-label">
            <IndexNav
              labels={labels}
              moving={moving}
              onNavChange={this.onNavChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Brand;
