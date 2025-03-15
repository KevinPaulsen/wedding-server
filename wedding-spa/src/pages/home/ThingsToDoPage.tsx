// pages/home/ThingsToDoPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import ComingSoonComponent from "../../components/main/ComingSoon";

const ThingsToDoPage: React.FC = () => {
  return (
      <BaseLayout>
        <ComingSoonComponent />
      </BaseLayout>
  );
};

export default ThingsToDoPage;
