import * as actionTypes from "../constants/categoryConstants";

import axios from "axios";
import apiURL from "../../utils/ToggleAPI";

export const getCategories = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${apiURL}/categories`);
        dispatch({
            type: actionTypes.GET_CATEGORIES_REQUEST,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
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

export const newCategory = (category) => async (dispatch, getState) => {
    const cat = getState().getCategories.categories;
    const { data } = await axios.post("/api/categories", { category });
    if (data.categoryCreated) {
        dispatch({
            type: actionTypes.INSERT_CATEGORY,
            payload: [...cat, data.categoryCreated],
        })
    }
}

export const deleteCategory = (category) => async (dispatch, getState) => {
    const cat = getState().getCategories.categories;
    const categories = cat.filter((item) => item.name !== category);
    const { data } = await axios.delete("/api/categories/" + encodeURIComponent(category));
    if (data.categoryDeleted) {
        dispatch({
           type: actionTypes.DELETE_CATEGORY, 
           payload: [...categories],
        })
    }
}
