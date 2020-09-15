import {  ACTIONS, ActionTypes } from '../interfaces/actionTypes/shareMovementTypes';

type BanksInitialState = {
    list: Array<string | number>;
    loading: boolean;
    pagination: any;
    lastMovement: Array<string | number>;
    lastMovementloading: boolean;
    listData: Array <string | number>;
}

const initialState: BanksInitialState = {
    list: [],
    loading: false,
    listData: [],
    lastMovement: [],
    lastMovementloading: false,
    pagination: {
        total: 0,
        perPage: 0,
        prevPageUrl: null,
        currentPage: 0,
    },
};

const transactionTypeReducer = (state = initialState, action: ActionTypes) => {
    switch (action.type) {
        case ACTIONS.GET_ALL:
            return {
                ...state,
                list: action.payload,
            };
                case ACTIONS.GET_LAST_MOVEMENT:
      return {
        ...state,
        lastMovement: action.payload
      };
      case ACTIONS.SET_LAST_MOVEMENT_LOADING:
        return {
          ...state,
          lastMovementloading: action.payload
        };
            case ACTIONS.GET_LIST:
                return {
                    ...state,
                    listData: action.payload,
                };
            case ACTIONS.SET_PAGINATION:
                return {
                    ...state,
                    pagination: action.payload,
                };
            case ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};

export default transactionTypeReducer;