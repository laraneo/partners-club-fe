import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { green } from "@material-ui/core/colors";

import './index.sass';
import { getAll, remove, search, update } from "../../actions/sharePermitMovementsTypesActions";
import { updateModal } from "../../actions/modalActions";
import SharePermitMovementsTypesForm from "../../components/SharePermitMovementsTypesForm";
import DataTable4 from '../../components/DataTable4'
import TransactionTypeColumn from '../../interfaces/TransactionTypeColumn';
import CustomSearch from '../../components/FormElements/CustomSearch';
import { Chip } from "@material-ui/core";


const GreenSwitch = withStyles({
  switchBase: {
    color: '#e74c3c',
    "&$checked": {
      color: '#27ae60'
    },
    "&$checked + $track": {
      backgroundColor: green[500]
    }
  },
  checked: {},
  track: {}
})(Switch);

interface Columns {
  id:
  | "id"
  | "desc"
  | "days"
  | "status"
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  component?: any;
}

export default function SharePermitMovementsTypes() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state: any) => state.sharePermitMovementsTypesReducer);
  useEffect(() => {
    async function fetchData() {
      dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const handleEdit = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <SharePermitMovementsTypesForm id={id} />
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <SharePermitMovementsTypesForm />
        }
      })
    );
  }

  const handleDelete = (id: number) => {
    dispatch(remove(id));
  };

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

  const getSelectedRow = (id: any) => list.find(((element: any) => element.id == id));


  const handleSwitchStatus = async (selectedId: number, selectedStatus: string) => {
    const status = selectedStatus === "1" ? 0 : 1;
    const data = {
      id: selectedId,
      status
    };
    await dispatch(update(data));
  };

  const columns: Columns[] = [
    {
      id: "id",
      label: "Id",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "desc",
      label: "Description",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "days",
      label: "Dias",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "days",
      label: "",
      minWidth: 250,
      align: "left",
      component: (value: any) => <span></span>
    },
    {
      id: "id",
      label: "Status",
      minWidth: 20,
      align: "left",
      component: (value: any) => {
        const selectedRow = getSelectedRow(value.value);
        return (
          <React.Fragment>
            <Chip
              label={selectedRow.status === "1" ? "Activo" : "Inactivo"}
              style={{
                backgroundColor: selectedRow.status === "1" ? "#2ecc71" : "#e74c3c",
                color: "white",
                fontWeight: "bold",
                fontSize: "10px"
              }}
              size="small"
            />
            <GreenSwitch
              checked={selectedRow.status == "1" ? true : false}
              onChange={() => handleSwitchStatus(selectedRow.id, selectedRow.status)}
            />
          </React.Fragment>
        )
      }
    },
  ];

  return (
    <div className="bank-container">
      <div className="bank-container__header">
        <div className="bank-container__title">Tipos de Permisos de Accion</div>
        <div className="bank-container__button" onClick={() => handleCreate()}>
          <Fab size="small" color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div className="bank-container__search">
        <CustomSearch handleSearch={handleSearch} />
      </div>
      <div>
        <DataTable4
          rows={list}
          pagination={pagination}
          columns={columns}
          handleEdit={handleEdit}
          loading={loading}
          onChangePage={handleChangePage}
          onChangePerPage={handlePerPage}
        />
      </div>
    </div>
  );
}
