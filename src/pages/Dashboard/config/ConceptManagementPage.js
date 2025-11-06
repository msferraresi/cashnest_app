import React from 'react';
import ManagementPage from '../../../components/admin/ManagementPage';
import CategoryIcon from '@mui/icons-material/Category';
function ConceptManagementPage() {

  return (
      <ManagementPage
        pageTitle="Gestión de Conceptos"
        pageIcon={<CategoryIcon />}
        apiEndpoint="concept"
        itemName="Concepto"
        itemType="el concepto"
      />
    );
}

export default ConceptManagementPage;