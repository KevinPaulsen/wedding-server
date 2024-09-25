import React from 'react';

const InfoContainer = (props) => {
    return (
        <div>
            <h1 className="text-center mb-4">{props.title}</h1>
            <div className="row justify-content-around align-items-center">
                {props.elements.map((item, index) => (
                    <div key={index} className="col-3 text-center">
                        <p className="info_element">{item.header}</p>
                        <p className="info_element">{item.body}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfoContainer;
