// pages/home/StoryPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import Story from '../../components/main/Story';

const StoryPage: React.FC = () => {
    return (
        <BaseLayout>
            <Story />
        </BaseLayout>
    );
};

export default StoryPage;
