// pages/home/WeddingPartyPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import WeddingPartyComponent from "../../components/main/WeddingPartyComponent";

const WeddingPartyPage: React.FC = () => {
  return (
      <BaseLayout>
        <WeddingPartyComponent/>
      </BaseLayout>
  );
};

export default WeddingPartyPage;
