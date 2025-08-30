// pages/home/ThingsToDoPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import ThingsToDoComponent from "../../components/main/things/ThingsToDoComponent";

const ThingsToDoPage: React.FC = () => {
  return (
      <BaseLayout>
        <ThingsToDoComponent/>
      </BaseLayout>
  );
};

export default ThingsToDoPage;
