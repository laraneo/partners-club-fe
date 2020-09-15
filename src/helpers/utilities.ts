const checkParameter =  (list: Array<string | number>, param: string) => {
    if (list.length > 0) {
      const current: any = list.find((e: any) => e.parameter === param);
      if (current) {
        if (current.value === "1") {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  }

  const getParameter = (list: Array<string | number>, parameter: any) => {
    const current: any =  list.find((e: any) => e.parameter === parameter);
    if(current) {
        return current;
    }
    return {};
  }

  const parseError = (err: any) => {
    console.log('err ', typeof err);
    if(typeof err === 'string' && err === 'Error: Network Error') {
      return 'Error en el Servidor';
    }
    if(typeof err === 'object') {
      if(err.response && err.response.status === 500) {
        return 'Error interno del Servidor';
      }
    }
    return err;
  }

export default {
    checkParameter,
    getParameter,
    parseError,
}