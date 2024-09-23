import React from 'react';
import '../styles/ImageWithText.css'

const PhotoSection = () => {
    return (
        <div className="container text-center">
            <div className="row justify-content-center align-items-center">
                <div className="col-md-3 mb-3">
                    <div className="photo-placeholder bg-secondary text-white py-5">Other Photo</div>
                </div>
                <div className="col-sm-3 mb-3">
                    <div className="image-container position-relative">
                        <img
                            src="/assets/mainCoupleImage.jpeg"
                            alt="Main Image"
                            className="img-fluid rounded"
                        />
                        <div className="text-overlay">
                            <h1 className="display-4 elegant-text">
                                09 . 13 . 2025
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="photo-placeholder bg-secondary text-white py-5">Other Photo</div>
                </div>
            </div>
        </div>
    );
};

export default PhotoSection;
