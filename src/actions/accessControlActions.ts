import API from "../api/AccessControl";
import snackBarUpdate from "../actions/snackBarActions";
import { updateModal } from "../actions/modalActions";
import { ACTIONS } from "../interfaces/actionTypes/accessControlTypes";
import { ACTIONS as personActions } from "../interfaces/actionTypes/personTypes";
import Axios from "../config/Axios";
import Prefix from "../config/ApiPrefix";
import headers from "../helpers/headers";
import moment from "moment";

export const getAll = (page: number = 1, perPage: number = 8) => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.getAll(page, perPage);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page
      };
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
};

export const getList = () => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.getList();
    let response = [];
    if (status === 200) {
      response = data;
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

export const search = (term: string, perPage: number = 8) => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.search(term, perPage);
    let response = [];
    if (status === 200) {
      response = data;
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page
      };
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
          message: "Ingreso Registrado!",
          type: "success",
          status: true,
          dashboardContent: true,
        }
      })(dispatch);
      dispatch({
        type: personActions.GET_FAMILIES_PARTNER_BY_CARD,
        payload: {}
      });
      dispatch({
        type: personActions.GET_GUEST_BY_PARTNER,
        payload: {}
      });
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false
      });
    }
    return createresponse;
  } catch (error) {
    let message = "Error en el Servidor";
    if (error && error.response) {
      const {
        data: { message: msg }
      } = error.response;
      message = msg;
    }
    snackBarUpdate({
      payload: {
        message,
        type: "warning",
        status: true,
        autoHide: false,
        dashboardContent: true,
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    throw error;
  }
};

export const get = (id: number) => async (dispatch: Function) => {
  try {
    const {
      data: { data },
      status
    } = await API.get(id);
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
          message: "Access control ha sido Actualizado!",
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
    let message = "Error en el Servidor";
    if (error && error.response) {
      const {
        data: { message: msg }
      } = error.response;
      message = msg;
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
          message: "Access control Eliminado!",
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

export const filter = (
  form: object,
  page: number = 1,
  perPage: number = 8
) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.filter(form, page, perPage);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page
      };
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
};

export const filterReport = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_REPORT_LOADING,
    payload: true
  });
  Axios({
    url: `${Prefix.api}/access-control-filter-report`,
    method: "GET",
    responseType: "blob", // important
    params: { ...body },
    headers: headers()
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "accessControlReport.pdf");
    document.body.appendChild(link);
    link.click();
    dispatch({
      type: ACTIONS.SET_REPORT_LOADING,
      payload: false
    });
  });
};

export const getPartnerFamilyStatistics = () => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.getPartnerFamilyStatistics();
    let response = [];
    if (status === 200) {
      response = data;
      let chart = { labels : [], dataMonth: []};
      if(data && data.length > 0) {
        const labels = data.map((e: any) => moment().month(e.month ).format("MMM"));
        const dataMonth = data.map((e: any) => e.cant);
        chart = { labels, dataMonth };
      }
      dispatch({
        type: ACTIONS.GET_PARTNER_FAMILY_STATISTICS,
        payload: chart
      });
      dispatch({
        type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
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
      type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
      payload: false
    });
    return error;
  }
};

export const getGuestStatistics = () => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_GUEST_STATISTICS_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.getGuestStatistics();
    let response = [];
    if (status === 200) {
      response = data;
      let chart = { labels : [], dataMonth: []};
      if(data && data.length > 0) {
        const labels = data.map((e: any) => moment().month(e.month ).format("MMM"));
        const dataMonth = data.map((e: any) => e.cant);
        chart = { labels, dataMonth };
      }
      dispatch({
        type: ACTIONS.GET_GUEST_STATISTICS,
        payload: chart
      });
      dispatch({
        type: ACTIONS.SET_GUEST_STATISTICS_LOADING,
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
      type: ACTIONS.SET_GUEST_STATISTICS_LOADING,
      payload: false
    });
    return error;
  }
};

export const getMonthlyIncomeStatistics = () => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.getMonthlyIncomeStatistics();
    let response = [];
    if (status === 200) {
      response = data;
      let chart = { labels : [], dataMonth: []};
      if(data && data.length > 0) {
        const labels = data.map((e: any) => moment().month(e.month ).format("MMM"));
        const dataMonth = data.map((e: any) => e.cant);
        chart = { labels, dataMonth };
      }
      dispatch({
        type: ACTIONS.GET_MONTHLY_INCOME_STATISTICS,
        payload: chart
      });
      dispatch({
        type: ACTIONS.GET_MONTHLY_INCOME_REPORT,
        payload: data
      });
      dispatch({
        type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
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
      type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
      payload: false
    });
    return error;
  }
};

export const getPartnerAgeStatistics = () => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.getPartnerAgeStatistics();
    let response = [];
    if (status === 200) {
      response = data;
      let chart = { labels : [], dataLabels: []};
      if(data && data.length > 0) {
        const labels = data.map((e: any) => e.label);
        const dataLabels = data.map((e: any) => e.data);
        chart = { labels, dataLabels };
      }
      dispatch({
        type: ACTIONS.GET_PARTNER_AGES_STATISTICS,
        payload: chart
      });
      dispatch({
        type: ACTIONS.GET_PARTNER_AGES_REPORT,
        payload: data
      });
      dispatch({
        type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
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
      type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
      payload: false
    });
    return error;
  }
};

export const getSonsMoreThan30Statistics = () => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
    payload: true
  });
  try {
    const {
      data: { data },
      status
    } = await API.getSonsMoreThan30Statistics();
    let response = [];
    if (status === 200) {
      response = data;
      let chart = { labels : [], dataLabels: []};
      if(data && data.length > 0) {
        // const labels = data.map((e: any) => e.label);
        // const dataLabels = data.map((e: any) => e.data);
        // chart = { labels, dataLabels };
      }
      // dispatch({
      //   type: ACTIONS.GET_PARTNER_SONS_30_STATISTICS,
      //   payload: chart
      // });
      dispatch({
        type: ACTIONS.GET_PARTNER_SONS_30_STATISTICS,
        payload: data
      });
      dispatch({
        type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
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
      type: ACTIONS.SET_PARTNER_FAMILY_STATISTICS_LOADING,
      payload: false
    });
    return error;
  }
};


