export const ACTIONS = {
  GET_ALL: 'share-permit-movements-types/get_all',
  GET: 'share-permit-movements-types/get',
  GET_LIST: 'share-permit-movements-types/get_list',
  SET_LOADING: 'share-permit-movements-types/set_loading',
  SET_PAGINATION: 'share-permit-movements-types/set_pagination',
};

interface Get {
  type: typeof ACTIONS.GET
  payload: Array<string|number>
}

interface GetAll {
  type: typeof ACTIONS.GET_ALL
  payload: Array<string|number>
}

interface GetList {
  type: typeof ACTIONS.GET_LIST
  payload: Array<string|number>
}

interface SetLoading {
  type: typeof ACTIONS.SET_LOADING
  payload: boolean
}

interface SetPagination {
  type: typeof ACTIONS.SET_PAGINATION
  payload: Array<string|number>
}


export type ActionTypes = Get | GetAll | SetLoading | SetPagination | GetList