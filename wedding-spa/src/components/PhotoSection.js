import React from 'react';

const PhotoSection = () => {
    return (
        <div className="container text-center">
            <div className="row justify-content-center align-items-center">
                <div className="col-md-3 mb-3">
                    <div className="photo-placeholder bg-secondary text-white py-5">Other Photo</div>
                </div>
                <div className="col-sm-3 mb-3">
                    <img
                        src="/assets/mainCoupleImage.jpeg"
                        alt="Main"
                        className="img-fluid rounded"
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <div className="photo-placeholder bg-secondary text-white py-5">Other Photo</div>
                </div>
            </div>
        </div>
    );
};

export default PhotoSection;
