import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import Text from "../../components/Text";
import { Link } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import Loading from "../../utils/loading";

const Maps = () => {
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    AxiosInstance.get("/maps").then((res) => {
      setMaps(res.data);
    });
  }, []);

  return (
    <div className="page-maps w-page-1">
      <Breadcrumbs
        items={[{ href: "/maps", item: <Text id="menu.maps">Maps</Text> }]}
      />

      {maps.length === 0 && (
        <div className="w-page-800">
          <Loading isError={false} />
        </div>
      )}

      <div className="maps-list">
        {maps.map((m) => (
          <div className="map shadow">
            <div className="view">
              <img src={m.image ? "img/maps/" + m.image : "img/map.png"} />
            </div>
            <div className="info">
              <div className="name">{m.name}</div>
              <div className="active-count"></div>

              <div className="text-right">
                <Link
                  to={"/map/" + m._id}
                  className="btn inline-block btn-lgiht"
                >
                  Zobrazit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maps;
