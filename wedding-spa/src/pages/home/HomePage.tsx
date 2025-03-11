// pages/home/HomePage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import MainPhoto from '../../components/main/MainPhoto';
import Timeline from "../../components/main/timeline/Timeline";

const HomePage: React.FC = () => {
  return (
      <BaseLayout>
        <MainPhoto/>
        <Timeline />
      </BaseLayout>
  );
};

export default HomePage;
