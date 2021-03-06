import API from "../api/Menu";
import snackBarUpdate from "../actions/snackBarActions";
import { updateModal } from "../actions/modalActions";
import { ACTIONS } from '../interfaces/actionTypes/menuTypes';

const attempts = window.attempts;

export const getAll = (page: number = 1, perPage: number = 8) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.getAll(page, perPage);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
        from: data.from,
        to: data.to
      }
      response = data.data;
      dispatch({
        type: ACTIONS.GET_ALL,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination
      });
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false
      });
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error"
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
}

const checkAuthRoutes = (items: Array<string | number>, location: string) => {
  const route = location === '/dashboard' ? '/dashboard/main' : location;
  const isValid = items.find((e: any) => e.route === route);
  if(!isValid) {
    window.location.href = "/#/dashboard/main";
  }
}

export const getList = (location: string, count: number = 0) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.getList();
    let response = [];
    if (status === 200) {
      response = data;
      checkAuthRoutes(data.items, location);
      dispatch({
        type: ACTIONS.GET_LIST,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false
      });
    }
    return response;
  } catch (error) {
    if(count <= attempts) {
      let counter = count + 1;
      dispatch(getList(location, counter));
    } else {
      snackBarUpdate({
        payload: {
          message: error.message,
          status: true,
          type: "error",
        },
      })(dispatch);
    }
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const getMenuList = () => async (dispatch: Function) => {
  dispatch(updateModal({
    payload: {
      isLoader: true,
    }
  }));
  try {
    const { data: { data }, status } = await API.getMenuList();
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_MENU_LIST,
        payload: response
      });
      dispatch(updateModal({
        payload: {
          isLoader: false,
        }
      }));
    }
    return response;
  } catch (error) {
    dispatch(updateModal({
      payload: {
        isLoader: false,
      }
    }));
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error"
      }
    })(dispatch);
    return error;
  }
};

export const getWidgetList = () => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_WIDGET_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.getWidgetList();
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_WIDGET_LIST,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_WIDGET_LOADING,
        payload: false
      });
    }
    return response;
  } catch (error) {
    dispatch({
      type: ACTIONS.SET_WIDGET_LOADING,
      payload: false
    });
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error"
      }
    })(dispatch);
    return error;
  }
};

export const search = (term: string, perPage: number = 8) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.search(term, perPage);
    let response = [];
    if (status === 200) {
      response = data;
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
        from: data.from,
        to: data.to
      }
      response = data.data;
      dispatch({
        type: ACTIONS.GET_ALL,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination
      });
    }
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error"
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const create = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const response = await API.create(body);
    const { status } = response;
    let createresponse: any = [];
    if (status === 200 || status === 201) {
      createresponse = response;
      snackBarUpdate({
        payload: {
          message: "Menu ha sido Creado!",
          type: "success",
          status: true
        }
      })(dispatch);
      dispatch(getAll());
      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null
          }
        })
      );
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false
      });
    }
    return createresponse;
  } catch (error) {
    let message = 'General Error';
    if (error && error.response) {
      const { data: { message: msg } } = error.response; 
      message = msg
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const get = (id: number) => async (dispatch: Function) => {
  try {
    const { data: { data }, status } = await API.get(id);
    let response = [];
    if (status === 200) {
      response = data;
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        type: "error",
        status: true
      }
    })(dispatch);
    return error;
  }
};

export const update = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const { data, status } = await API.update(body);
    let response: any = [];
    if (status === 200) {
      response = {
        data,
        status
      };
      snackBarUpdate({
        payload: {
          message: "Menu ha sido Actualizado!",
          type: "success",
          status: true
        }
      })(dispatch);
      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null
          }
        })
      );
      dispatch(getAll());
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false
      });
    }
    return response;
  } catch (error) {
    let message = 'General Error';
    if (error && error.response) {
      const { data: { message: msg } } = error.response; 
      message = msg
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const remove = (id: number) => async (dispatch: Function) => {
  try {
    const { data, status } = await API.remove(id);
    let response: any = [];
    if (status === 200) {
      response = {
        data,
        status
      };
      snackBarUpdate({
        payload: {
          message: "Menu Eliminado!",
          type: "success",
          status: true
        }
      })(dispatch);
      dispatch(getAll());
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        type: "error",
        status: true
      }
    })(dispatch);
    return error;
  }
};