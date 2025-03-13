// pages/home/StoryPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import StoryComponent from '../../components/main/ourStory/StoryComponent';

const StoryPage: React.FC = () => {
  return (
      <BaseLayout>
        <StoryComponent/>
      </BaseLayout>
  );
};

export default StoryPage;
