import PropTypes from "prop-types";
import React, { useContext } from "react";
import Translations from "../utils/Translations";

const T = (props) => {
  return Translations.getId(props.id);
};

T.propTypes = {
  id: PropTypes.string.isRequired,
};

export default T;
