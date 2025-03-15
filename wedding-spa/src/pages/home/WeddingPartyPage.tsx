// pages/home/WeddingPartyPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import ComingSoonComponent from "../../components/main/ComingSoon";

const WeddingPartyPage: React.FC = () => {
  return (
      <BaseLayout>
        <ComingSoonComponent />
      </BaseLayout>
  );
};

export default WeddingPartyPage;
