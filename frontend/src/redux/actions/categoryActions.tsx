import * as actionTypes from "../constants/categoryConstants";

import axios from "axios";
import apiURL from "../../utils/ToggleAPI";

export const getCategories = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiURL}/categories`);
    dispatch({
      type: actionTypes.GET_CATEGORIES_REQUEST,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};
