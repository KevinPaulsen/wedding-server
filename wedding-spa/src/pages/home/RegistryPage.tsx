// pages/home/RegistryPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import RegistryComponent from "../../components/main/registry/RegistryComponent";

const RegistryPage: React.FC = () => {
  return (
      <BaseLayout>
        <RegistryComponent />
      </BaseLayout>
  );
};

export default RegistryPage;
