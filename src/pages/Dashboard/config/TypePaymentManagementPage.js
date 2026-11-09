import React from 'react';
import ManagementPage from '../../../components/admin/ManagementPage';
import CreditCardIcon from '@mui/icons-material/CreditCard';

function TypePaymentManagementPage() {
  return (
    <ManagementPage
      pageTitle="Gestión de Tipos de Pago"
      pageIcon={<CreditCardIcon />}
      apiEndpoint="type_payment"
      itemName="Tipo de Pago"
      itemType="el tipo de pago"
    />
  );
}

export default TypePaymentManagementPage;