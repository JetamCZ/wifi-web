import React from "react";
import Text from "./Text";

const Breadcrumbs = (props) => {
  return (
    <div className="breadcrumbs">
      <a href="/">
        <span className="item">
          <Text id="title">Locate.io</Text>
        </span>
      </a>
      <span className="divider">&#62;</span>
      {props.items.map((item, index) => (
        <span key={Math.random()}>
          {item.href ? (
            <a href={item.href}>
              <span className="item">{item.item}</span>
            </a>
          ) : (
            <span className="item">{item.item}</span>
          )}

          {index !== props.items.length - 1 && (
            <span className="divider">&#62;</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
