import React from 'react';
import ManagementPage from '../../../components/admin/ManagementPage';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

function CurrencyManagementPage() {
  return (
    <ManagementPage
      pageTitle="Gestión de Monedas"
      pageIcon={<AttachMoneyIcon />}
      apiEndpoint="currency"
      itemName="Moneda"
      itemType="la moneda"
    />
  );
}

export default CurrencyManagementPage;