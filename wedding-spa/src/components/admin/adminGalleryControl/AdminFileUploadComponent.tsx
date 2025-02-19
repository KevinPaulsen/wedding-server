// AdminFileUploadComponent.jsx
import React, { useState } from 'react';
import {
    Container,
    Button,
    Form,
    Alert,
    Spinner,
    Row,
    Col,
} from 'react-bootstrap';
import { useUploadPhoto } from '../../../hooks/gallery/useUploadPhoto';

const AdminFileUploadComponent: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploadStatus, setUploadStatus] = useState<
        { fileName: string; status: string }[]
    >([]);
    const [completedCount, setCompletedCount] = useState<number>(0);
    // Destructure "execute" as "upload" from our useUploadPhoto hook
    const { execute: upload, loading, error } = useUploadPhoto();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
        setUploadStatus([]);
        setCompletedCount(0);
    };

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) return;
        const statusArray: { fileName: string; status: string }[] = [];

        // Process each file sequentially
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            // Call our generic hook's execute function.
            await upload(file);

            // Check the hook's error state immediately after calling upload.
            if (error) {
                statusArray.push({ fileName: file.name, status: 'Upload failed: ' + error });
            } else {
                statusArray.push({ fileName: file.name, status: 'Uploaded successfully' });
            }
            setCompletedCount(prev => prev + 1);
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
                            <Form.Label column="lg">
                                Select images to upload
                            </Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={{ outline: '2px solid var(--main-dark)' }}
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button
                                className="rsvp-button dark width-auto"
                                onClick={handleUpload}
                                disabled={loading || !selectedFiles || selectedFiles.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        {' Uploading...'}
                                    </>
                                ) : (
                                    'Upload'
                                )}
                            </Button>
                        </div>
                    </Form>
                    {selectedFiles && selectedFiles.length > 0 && (
                        <div className="mt-3 text-center">
                            <strong>
                                Uploaded {completedCount} of {selectedFiles.length} photos
                            </strong>
                        </div>
                    )}
                    {error && (
                        <Alert variant="danger" className="mt-3">
                            Error: {error}
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminFileUploadComponent;
