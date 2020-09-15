import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { green } from "@material-ui/core/colors";

import './index.sass';
import { getAll, remove, search, update } from "../../actions/sharePermitMovementActions";
import { updateModal } from "../../actions/modalActions";
import SharePermitMovementForm from "../../components/SharePermitMovementForm";
import DataTable4 from '../../components/DataTable4'
import TransactionTypeColumn from '../../interfaces/TransactionTypeColumn';
import CustomSearch from '../../components/FormElements/CustomSearch';
import { Chip } from "@material-ui/core";
import moment from "moment";


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
  | "share"
  | "share_permit_movements_types"
  | "created_at"
  | "status"
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  component?: any;
}

export default function SharePermitMovement() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state: any) => state.sharePermitMovementReducer);
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
          element: <SharePermitMovementForm id={id} />
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <SharePermitMovementForm />
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
    if (selectedStatus === "1") {
      const data = {
        id: selectedId,
        status: 0,
      };
      dispatch(update(data));
    }

  };

  const columns: Columns[] = [
    {
      id: "id",
      label: "Id",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "created_at",
      label: "Fecha",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{moment(value.value).format("DD-MM-YYYY")} <br /> {moment(value.value).format("h:mm:ss A")}</span>
    },
    {
      id: "desc",
      label: "Description",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "share_permit_movements_types",
      label: "Tipo",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{value.value && value.value.desc}</span>
    },
    {
      id: "days",
      label: "Dias",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "share",
      label: "Accion",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{value.value && value.value.share_number}</span>
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
        <div className="bank-container__title">Permisos de Acciones</div>
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
          loading={loading}
          onChangePage={handleChangePage}
          onChangePerPage={handlePerPage}
        />
      </div>
    </div>
  );
}
