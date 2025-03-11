// pages/home/HomePage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import MainPhoto from '../../components/main/MainPhoto';

const HomePage: React.FC = () => {
  return (
      <BaseLayout>
        <MainPhoto/>
      </BaseLayout>
  );
};

export default HomePage;
