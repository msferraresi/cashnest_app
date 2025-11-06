import React from 'react';
import ManagementPage from '../../../components/admin/ManagementPage';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function StatusManagementPage() {
  return (
    <ManagementPage
      pageTitle="Gestión de Estados"
      pageIcon={<CheckCircleOutlineIcon />}
      apiEndpoint="status"
      itemName="Estado"
      itemType="el estado"
    />
  );
}

export default StatusManagementPage;