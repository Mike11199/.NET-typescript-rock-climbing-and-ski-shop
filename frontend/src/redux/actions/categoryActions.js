import * as actionTypes from "../constants/categoryConstants";

import axios from "axios";

export const getCategories = () => async (dispatch) => {
    const { data } = await axios.get("/api/categories");
    dispatch({
        type: actionTypes.GET_CATEGORIES_REQUEST,
        payload: data,
    })
}

export const saveAttributeToCatDoc = (key, val, categoryChoosen) => async (dispatch, getState) => {
   const { data } = await axios.post("/api/categories/attr", { key, val, categoryChoosen }); 
   if (data.categoryUpdated) {
       dispatch({
           type: actionTypes.SAVE_ATTR,
           payload: [...data.categoryUpdated],
       })
   }
}
