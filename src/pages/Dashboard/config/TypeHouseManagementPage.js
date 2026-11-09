import React from 'react';
import ManagementPage from '../../../components/admin/ManagementPage';
import HouseIcon from '@mui/icons-material/House';

function TypeHouseManagementPage() {
  return (
    <ManagementPage
      pageTitle="Gestión de Tipos de Domicilio"
      pageIcon={<HouseIcon />}
      apiEndpoint="type_house"
      itemName="Tipo de Domicilio"
      itemType="el tipo de domicilio"
    />
  );
}

export default TypeHouseManagementPage;