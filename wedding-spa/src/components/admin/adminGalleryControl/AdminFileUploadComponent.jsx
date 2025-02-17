// AdminFileUploadComponent.jsx
import React, { useState } from 'react';
import { Container, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useUploadPhoto } from '../../../hooks/useUploadPhoto'; // adjust the path as needed

const AdminFileUploadComponent = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState([]);
    const [completedCount, setCompletedCount] = useState(0);
    const { upload, loading, error } = useUploadPhoto();

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
        setUploadStatus([]);
        setCompletedCount(0);
    };

    const handleUpload = async () => {
        if (!selectedFiles.length) return;
        const statusArray = [];
        // Loop through all selected files sequentially so we can update progress after each file.
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            try {
                await upload(file);
                statusArray.push({ fileName: file.name, status: 'Uploaded successfully' });
            } catch (err) {
                statusArray.push({ fileName: file.name, status: 'Upload failed: ' + err.message });
            } finally {
                setCompletedCount(prev => prev + 1);
            }
        }
        setUploadStatus(statusArray);
    };

    return (
            <Container className="d-flex flex-column align-items-center mb-3">
                <Row className="w-100">
                    <Col xs={12} md={6} className="mx-auto text-center">
                        <h2 className="text-center mb-4">Upload Multiple Images</h2>
                        <Form>
                            <Form.Group controlId="formFileMultiple" className="mb-3">
                                <Form.Label column={"lg"}>Select images to upload</Form.Label>
                                <Form.Control type="file" multiple onChange={handleFileChange} style={{outline: '2px solid var(--main-dark)'}}/>
                            </Form.Group>
                            <div className="text-center">
                                <Button className="rsvp-button dark width-auto" onClick={handleUpload} disabled={loading || selectedFiles.length === 0}>
                                    {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                {' Uploading...'}
                                            </>
                                    ) : (
                                             'Upload'
                                     )}
                                </Button>
                            </div>
                        </Form>
                        {/* Display progress if files have been selected */}
                        {selectedFiles.length > 0 && (
                                <div className="mt-3 text-center">
                                    <strong>
                                        Uploaded {completedCount} of {selectedFiles.length} photos
                                    </strong>
                                </div>
                        )}
                        {/* Display any overall error */}
                        {error && <Alert variant="danger" className="mt-3">Error: {error}</Alert>}
                    </Col>
                </Row>
            </Container>
    );
};

export default AdminFileUploadComponent;
