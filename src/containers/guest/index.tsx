import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';

import './index.sass';
import { getAllGuest, remove, search, searchByGuest } from "../../actions/personActions";
import { updateModal } from "../../actions/modalActions";
import DataTable4 from '../../components/DataTable4';
import PersonColumn from '../../interfaces/PersonColumn';
import CustomSearch from '../../components/FormElements/CustomSearch';
import { Chip } from "@material-ui/core";
import SingleGuestForm from "../../components/SingleGuestForm";

const columns: PersonColumn[] = [
  {
    id: "id",
    label: "Id", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "rif_ci",
    label: "RIF/CI",
    minWidth: 170,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "name",
    label: "Nombre",
    minWidth: 170,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "last_name",
    label: "Apellido",
    minWidth: 170,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "primary_email",
    label: "Correo Primario",
    minWidth: 170,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
];

export default function Guest() {
  const dispatch = useDispatch();
  const { persons, loading, pagination } = useSelector((state: any) => state.personReducer);
  useEffect(() => {
    async function fetchData() {
      dispatch(getAllGuest());
    }
    fetchData();
  }, [dispatch]);

  const handleEdit = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <SingleGuestForm id={id} />,
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <SingleGuestForm />,
        }
      })
    );
  }

  const handleDelete = (id: number) => {
    dispatch(remove(id));
  };

  const handleSearch = (event: any) => {
    if (event.value.trim() === '') {
      dispatch(getAllGuest())
    } else {
      dispatch(searchByGuest(event.value))
    }
  }

  const handleChangePage = (newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAllGuest(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    dispatch(getAllGuest(page, perPage))
  }

  return (
    <div className="person-container">
      <div className="person-container__header">
        <div className="person-container__title">Invitados</div>
        <div className="person-container__button" onClick={() => handleCreate()}>
          <Fab size="small" color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div className="person-container__search">
        <CustomSearch handleSearch={handleSearch} />
      </div>
      <div>
        <DataTable4
          rows={persons}
          pagination={pagination}
          columns={columns}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          onChangePage={handleChangePage}
          onChangePerPage={handlePerPage}
        />
      </div>
    </div>
  );
}
