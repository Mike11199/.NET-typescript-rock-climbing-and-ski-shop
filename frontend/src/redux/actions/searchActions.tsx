import * as actionTypes from "../constants/searchConstants";

export const updateSearchString = (searchString) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.UPDATE_SEARCH,
    payload: searchString,
  });
};
