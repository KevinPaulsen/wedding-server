// RsvpRow.tsx
import React, { useState } from 'react';
import { Badge, Col, Row, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import GuestDetails from './GuestDetails';
import { useNavigate } from 'react-router-dom';
import "../../../styles/Table.css";
import { useFlow } from "../../../FlowProvider";
import { transformGuestDetails } from "../../../services/DataTransformService";

interface RsvpEntry {
    rsvpCode: string;
    primaryContact: {
        name: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
    };
    allowedGuestCount: number;
    rsvpStatus: string;
    lastnames: string[];
    rsvpGuestDetails: any[];
}

interface RsvpRowProps {
    rsvpEntry: RsvpEntry;
    deleteRsvp: (rsvpCode: string) => Promise<void>;
}

const RsvpRow: React.FC<RsvpRowProps> = ({ rsvpEntry, deleteRsvp }) => {
    const { setFormData, updatePreferredContactField } = useFlow();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRowClick = () => {
        setIsExpanded(!isExpanded);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData({ rsvpCode: rsvpEntry.rsvpCode });
        setFormData({ lastname: (rsvpEntry.lastnames && rsvpEntry.lastnames.find(str => str != null && str.trim() !== '') || '') });
        setFormData({ rsvpStatus: rsvpEntry.rsvpStatus });
        setFormData({ allowedGuestCount: rsvpEntry.allowedGuestCount });
        updatePreferredContactField("name", rsvpEntry.primaryContact.name);
        updatePreferredContactField("email", rsvpEntry.primaryContact.email);
        updatePreferredContactField("phone", rsvpEntry.primaryContact.phoneNumber);
        updatePreferredContactField("address", rsvpEntry.primaryContact.address);
        setFormData({ guests: transformGuestDetails(rsvpEntry.rsvpGuestDetails) });

        navigate(`/admin/edit-rsvp/`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
        await deleteRsvp(rsvpEntry.rsvpCode);
        setIsDeleting(false);
    };

    const getStatusVariant = (status: string): string => {
        switch (status) {
            case 'ATTENDING':
                return 'badge-attending';
            case 'NOT_ATTENDING':
                return 'badge-not-attending';
            case 'PENDING':
                return 'badge-pending';
            default:
                return 'badge-primary';
        }
    };

    return (
        <>
            <tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
                <td>{rsvpEntry.rsvpCode}</td>
                <td>{rsvpEntry.primaryContact.name}</td>
                <td className="d-none d-md-table-cell">{rsvpEntry.allowedGuestCount}</td>
                <td>
                    <Badge className={getStatusVariant(rsvpEntry.rsvpStatus)}>
                        {rsvpEntry.rsvpStatus.replace('_', ' ')}
                    </Badge>
                </td>
                <td>
                    <Row className="align-items-center justify-content-center">
                        <Col className="col-auto">
                            <FaEdit
                                onClick={handleEdit}
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                title="Edit RSVP"
                                size={25}
                            />
                        </Col>
                        <Col className="col-auto">
                            {isDeleting ? (
                                <Spinner
                                    animation="border"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ width: '25px', height: '25px' }}
                                />
                            ) : (
                                <FaTrash
                                    onClick={handleDelete}
                                    style={{ cursor: 'pointer' }}
                                    title="Delete RSVP"
                                    size={25}
                                />
                            )}
                        </Col>
                    </Row>
                </td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={100}>
                        <GuestDetails rsvpEntry={rsvpEntry} />
                    </td>
                </tr>
            )}
        </>
    );
};

export default RsvpRow;
