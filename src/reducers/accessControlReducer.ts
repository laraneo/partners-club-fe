import {
  ACTIONS,
  ActionTypes,
} from "../interfaces/actionTypes/accessControlTypes";

type InitStatess = {
  list: Array<string | number>;
  partnerFamilyStatistics: Array<string | number>;
  guestStatisticsGraph: Array<string | number>;
  monthlyIncomes: Array<string | number>;
  partnerAges: Array<string | number>;
  partnerSons30: Array<string | number>;
  monthlyIncomesReport: Array<string | number>;
  partnerAgesReport: Array<string | number>;
  loading: boolean;
  partnerFamilyStatisticsLoading: boolean;
  guestStatisticsGraphLoading: boolean;
  pagination: any;
  listData: any;
};

const initialState: InitStatess = {
  list: [],
  loading: false,
  pagination: {
    total: 0,
    perPage: 0,
    prevPageUrl: null,
    currentPage: 0,
  },
  listData: [],
  partnerFamilyStatistics: [],
  partnerFamilyStatisticsLoading: false,
  guestStatisticsGraph: [],
  guestStatisticsGraphLoading: false,
  monthlyIncomes: [],
  monthlyIncomesReport: [],
  partnerAges: [],
  partnerAgesReport: [],
  partnerSons30: [],
};

const accessControlReducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case ACTIONS.GET_ALL:
      return {
        ...state,
        list: action.payload,
      };
    case ACTIONS.GET_LIST:
      return {
        ...state,
        listData: action.payload,
      };
    case ACTIONS.GET_PARTNER_FAMILY_STATISTICS:
      return {
        ...state,
        partnerFamilyStatistics: action.payload,
      };
    case ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING:
      return {
        ...state,
        partnerFamilyStatisticsLoading: action.payload,
      };
    case ACTIONS.GET_GUEST_STATISTICS:
      return {
        ...state,
        guestStatisticsGraph: action.payload,
      };
    case ACTIONS.GET_MONTHLY_INCOME_STATISTICS:
      return {
        ...state,
        monthlyIncomes: action.payload,
      };
    case ACTIONS.GET_PARTNER_AGES_STATISTICS:
      return {
        ...state,
        partnerAges: action.payload,
      };
    case ACTIONS.GET_PARTNER_SONS_30_STATISTICS:
      return {
        ...state,
        partnerSons30: action.payload,
      };
    case ACTIONS.GET_MONTHLY_INCOME_REPORT:
      return {
        ...state,
        monthlyIncomesReport: action.payload,
      };
    case ACTIONS.GET_PARTNER_AGES_REPORT:
      return {
        ...state,
        partnerAgesReport: action.payload,
      };
    case ACTIONS.SET_GUEST_STATISTICS_LOADING:
      return {
        ...state,
        guestStatisticsGraphLoading: action.payload,
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

export default accessControlReducer;
