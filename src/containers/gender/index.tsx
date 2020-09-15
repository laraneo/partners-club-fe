import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';

import './index.sass';
import { getAll, remove, search } from "../../actions/genderActions";
import { updateModal } from "../../actions/modalActions";
import GenderForm from "../../components/GenderForm";
import DataTable4 from '../../components/DataTable4'
import MasterTableColumns from '../../interfaces/MasterTableColumns';
import CustomSearch from '../../components/FormElements/CustomSearch';

const columns: MasterTableColumns[] = [
  {
    id: "id",
    label: "Id",
    minWidth: 30,
    component: (value: any) => <span>{value.value}</span>
  },
  {
    id: "description",
    label: "Description",
    minWidth: 30,
    component: (value: any) => <span>{value.value}</span>
  },
];

export default function Gender() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state: any) => state.genderReducer);
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
          element: <GenderForm id={id} />
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <GenderForm />
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

  return (
    <div className="gender-container">
      <div className="gender-container__header">
        <div className="gender-container__title">Sexo</div>
        <div className="gender-container__button" onClick={() => handleCreate()}>
          <Fab size="small" color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div className="gender-container__search">
        <CustomSearch handleSearch={handleSearch} />
      </div>
      <div>
        <DataTable4
          rows={list}
          columns={columns}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}
