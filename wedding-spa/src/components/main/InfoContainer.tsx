// InfoContainer.tsx
import React from 'react';
import { Col, Container, Row } from "react-bootstrap";

interface InfoElement {
    header: string | number;
    body: string | number;
}

interface InfoContainerProps {
    title: string;
    elements: InfoElement[];
}

const InfoContainer: React.FC<InfoContainerProps> = (props) => {
    return (
        <Container fluid>
            <h1 className="text-center mb-4">{props.title}</h1>
            <Row className="g-0 justify-content-around align-items-center">
                {props.elements.map((item, index) => (
                    <Col key={index} className="text-center">
                        <p className="info_element">{item.header}</p>
                        <p className="info_element">{item.body}</p>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default InfoContainer;
