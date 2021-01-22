import React, { createRef, useState } from "react";

const SelectMoreInput = (props) => {
  const addRef = createRef();

  const [selected, setSelecter] = useState([]);

  const add = (item) => {
    const sel = [...selected];
    sel.push(item);

    setSelecter(sel);
    props.onChange(sel);
  };

  const isSelected = (v) => {
    return selected.find((s) => s.value === v);
  };

  const rm = (item) => {
    const sel = selected.filter((s) => s.value !== item.value);

    setSelecter(sel);
    props.onChange(sel);
  };

  return (
    <>
      <div className="input-status selectMore">
        <div className="items">
          {selected.map((item) => (
            <div className="item">
              {item.name}{" "}
              <img
                src="/img/icons/x.svg"
                alt=""
                className="rm"
                onClick={() => rm(item)}
              />
            </div>
          ))}
          {selected.length === 0 && "Vyber z nabídky pod tímto polem..."}
        </div>
      </div>
      {props.items
        .filter((i) => !isSelected(i.value))
        .map((item) => (
          <div className="btn sm success" onClick={() => add(item)}>
            {item.name}
          </div>
        ))}
    </>
  );
};

export default SelectMoreInput;
