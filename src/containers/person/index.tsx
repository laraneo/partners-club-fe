import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';

import './index.sass';
import { getAll, remove, search, clearPersons } from "../../actions/personActions";
import { updateModal } from "../../actions/modalActions";
import PersonForm from "../../components/PersonForm";
import DataTable4 from '../../components/DataTable4';
import PersonColumn from '../../interfaces/PersonColumn';
import CustomSearch from '../../components/FormElements/CustomSearch';
import { Chip } from "@material-ui/core";

const columns: PersonColumn[] = [
  {
    id: "id",
    label: "Id", minWidth: 10,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "shares",
    label: "Acciones",
    minWidth: 20,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "rif_ci",
    label: "RIF/CI",
    minWidth: 30,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "isPartner",
    label: "Parentesco",
    minWidth: 30,
    align: "right",
    component: (value: any) => {
      return (
        <Chip
          label={value.value === "1" ? "Socio" : "Familiar"}
          style={{
            backgroundColor: value.value === "1" ? "#2ecc71" : "#f1c40f",
            color: "white",
            fontWeight: "bold",
            fontSize: "10px"
          }}
          size="small"
        />
      )
    }
  },
{
  id: "name",
    label: "Nombre",
      minWidth: 30,
        align: "right",
          component: (value: any) => <span>{value.value}</span> ,
  },
{
  id: "last_name",
    label: "Apellido",
      minWidth: 30,
        align: "right",
          component: (value: any) => <span>{value.value}</span> ,
  },
{
  id: "primary_email",
    label: "Correo Primario",
      minWidth: 30,
        align: "right",
          component: (value: any) => <span>{value.value}</span> ,
  },
];

export default function Person() {
  const dispatch = useDispatch();
  const { persons, loading, pagination } = useSelector((state: any) => state.personReducer);
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
          element: <PersonForm id={id} />,
          customSize: 'large'
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <PersonForm />,
          customSize: 'large'
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

  useEffect(() => {
    return () => {
      dispatch(clearPersons());
    };
  }, [dispatch]);

  return (
    <div className="person-container">
      <div className="person-container__header">
        <div className="person-container__title">Socio</div>
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
