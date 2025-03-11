// pages/home/Details.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import Timeline from '../../components/main/timeline/Timeline';
import DetailsComponent from "../../components/main/DetailsComponent";

const Details: React.FC = () => {
  return (
      <BaseLayout>
        <DetailsComponent />
      </BaseLayout>
  );
};

export default Details;
