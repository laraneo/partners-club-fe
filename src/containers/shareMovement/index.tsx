import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';
import Grid from "@material-ui/core/Grid";

import './index.sass';
import { getAll, search } from "../../actions/shareMovementActions";
import { updateModal } from "../../actions/modalActions";
import ShareMovemenForm from "../../components/ShareMovementForm";
import DataTable4 from '../../components/DataTable4'
import ShareMovementColumns from '../../interfaces/ShareMovementColumns';
import CustomSearch from '../../components/FormElements/CustomSearch';
import moment from "moment";
import { Button } from "@material-ui/core";
import ShareMovementFormDisable from "../../components/ShareMovementFormDisable";
import { useHistory } from "react-router-dom";

const columns: ShareMovementColumns[] = [
  {
    id: "id",
    label: "Id",
    minWidth: 10,
    component: (value: any) => <span>{value.value}</span>
  },
  {
    id: "created",
    label: "Fecha",
    minWidth: 30,
    align: "left",

    component: (value: any) => <span>{moment(value.value).format('DD-MM-YYYY')}</span>
  },
  {
    id: "transaction",
    label: "Tipo",
    minWidth: 30,
    align: "left",

    component: (value: any) => <span>{value.value.description}</span>
  },
  {
    id: "share",
    label: "N° Accion",
    minWidth: 30,
    align: "left",

    component: (value: any) => <span>{value.value.share_number}</span>
  },
  {
    id: "partner",
    label: "Socio",
    minWidth: 30,
    align: "left",

    component: (value: any) => <span>{value.value.name} {value.value.last_name}</span>
  },
  {
    id: "titular",
    label: "Titular",
    minWidth: 30,
    align: "left",

    component: (value: any) => <span>{value.value.name} {value.value.last_name}</span>
  },
  {
    id: "description",
    label: "Description",
    minWidth: 30,
    align: "left",
    component: (value: any) => <span>{value.value}</span>
  },
  {
    id: "currency",
    label: "Moneda",
    minWidth: 30,
    align: "right",

    component: (value: any) => <span>{value.value ? value.value.description : '-'}</span>
  },
  {
    id: "number_sale_price",
    label: "Precio Venta",
    minWidth: 30,
    align: "right",

    component: (value: any) => <span>{value.value}</span>
  },
  {
    id: "number_procesed",
    label: "N° Procesado",
    minWidth: 30,
    align: "center",

    component: (value: any) => <span>{value.value}</span>
  },
];

export default function ShareMovement() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state: any) => state.shareMovementReducer);
  const history = useHistory();
  useEffect(() => {
    async function fetchData() {
      dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <ShareMovemenForm />
        }
      })
    );
  }

  const handleSearch = (event: any) => {
    if (event.value.trim() === '') {
      dispatch(getAll())
    } else {
      dispatch(search(event.value))
    }
  }

  const handleChangePage = (newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAll(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    dispatch(getAll(page, perPage))
  }

  const handleButton = (condition: string, title: string) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <ShareMovementFormDisable condition={condition} title={title} />
        }
      })
    );
  }

  const renderButton = (title: string, color: string) => {
    return <Button
      type="button"
      fullWidth
      variant="contained"
      style={{ backgroundColor: color, color: 'white' }}
    >
      {title}
    </Button>
  }

  return (
    <Grid container spacing={3}>

      <Grid item xs={12}>Movimientos de Acciones</Grid>
      <Grid item xs={6}> <CustomSearch handleSearch={handleSearch} /> </Grid>
      <Grid item xs={6} style={{ textAlign: 'right' }} >
        <Grid container spacing={3} style={{ textAlign: 'right' }}>
          <Grid item xs={11}>
            <Grid container spacing={3}>
              <Grid item xs={6} onClick={() => history.push('/dashboard/share-permit-movements')} >{renderButton('Dar Permiso', '#3f51b5')}</Grid>
              <Grid item xs={6} onClick={() => handleButton('DAR_DE_BAJA', 'Dar de Baja')} >{renderButton('Dar de Baja', '#3f51b5')}</Grid>
              <Grid item xs={6} onClick={() => history.push('/dashboard/share-permit-movements')} >{renderButton('Revocar Permiso', '#27ae60')}</Grid>
              <Grid item xs={6} onClick={() => handleButton('RECUPERAR_BAJA', 'Recuperar Baja')} >{renderButton('Recuperar Baja', '#27ae60')}</Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} onClick={() => handleCreate()}  style={{ textAlign: 'right' }}>
            <Fab size="small" color="primary" aria-label="add"> <AddIcon /></Fab>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>

        <DataTable4
          rows={list}
          pagination={pagination}
          columns={columns}
          loading={loading}
          onChangePage={handleChangePage}
          onChangePerPage={handlePerPage}
        />

      </Grid>

    </Grid >
  );
}
