import { UPDATE_SEARCH } from "../constants/searchConstants";

const MODE_INITIAL_STATE = {
  searchString: "",
};

export const searchStringReducer = (state = MODE_INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SEARCH:
      return {
        ...state,
        searchString: action.payload,
      };

    default:
      return state;
  }
};
