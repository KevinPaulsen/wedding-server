// Details.tsx
import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import Timeline from "../../components/main/timeline/Timeline";

const Details: React.FC = () => {
    return (
        <BaseLayout>
            <>
                <h1 className="text-center mb-3">Wedding Details</h1>
                <Timeline />
            </>
        </BaseLayout>
    );
};

export default Details;
