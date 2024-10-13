import React from 'react';
import PropTypes from 'prop-types';

const LastNamesInfo = ({ lastNames }) => (
    <div>
        <h5>Last Names</h5>
        <div className="text-start">
            {lastNames.map(lastName => <div>{lastName}</div>)}
        </div>
    </div>
);

LastNamesInfo.propTypes = {
    lastNames: PropTypes.array.isRequired,
};

export default LastNamesInfo;
