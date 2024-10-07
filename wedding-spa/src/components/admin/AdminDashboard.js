// AdminDashboard.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RsvpTable from "./RsvpTable";

function AdminDashboard() {
    return (
        <div>
            {/* Main Content */}
            <div className="container-fluid">
                <div className="row">
                    <h1 className="mt-4">Welcome, Admin!</h1>
                    <p>This is your dashboard where you can manage the application.</p>

                    <RsvpTable data={testData}/>
                </div>
            </div>
        </div>
    );
}

// Sample Data
const sampleData = [
    {
        name: 'John Doe',
        rsvpCode: '1234',
        allowedGuests: 3,
        guestsAttending: 2,
        email: 'johndoe@example.com',
        phoneNumber: '123-456-7890',
        address: '123 Main St, City, State, ZIP',
        guests: [
            {
                name: 'Jane Doe',
                foodOption: 'Chicken',
                dietaryRestrictions: 'Gluten-free',
                other: 'None',
            },
            {
                name: 'Jimmy Doe',
                foodOption: 'Vegetarian',
                dietaryRestrictions: 'None',
                other: 'No nuts',
            },
        ],
    },
    // Add more sample data objects as needed
];

const testData = [
    {
        "rsvpCode": "test",
        "primaryContact": {
            "name": "Kris Paulsen",
            "email": "kris@email.com",
            "phoneNumber": "+1 (503) 9999-999",
            "address": "5638 SW Haines St.\nPortland, OR, 98105"
        },
        "lastNames": ["Paulsen"],
        "allowedGuestCount": 4,
        "guestCount": 2,
        "rsvpGuestDetails": [
            {
                "name": "Kris Paulsen",
                "foodOption": "MEAT",
                "dietaryRestrictions": ["GLUTEN_FREE", "NUT_FREE"],
                "other": ""
            },
            {
                "name": "Angela Paulsen",
                "foodOption": "VEGGIE",
                "dietaryRestrictions": [],
                "other": "I only eat at 6:09pm"
            }
        ]
    },
    {
        "rsvpCode": "test2",
        "primaryContact": {
            "name": "Ken Paulsen",
            "email": "kenapaulsen@gmail.com",
            "phoneNumber": "+1 (503) 8888-888",
            "address": "5638 SW Haines St.\nPortland, OR, 97111"
        },
        "lastNames": ["Paulsen"],
        "allowedGuestCount": 2,
        "guestCount": 2,
        "rsvpGuestDetails": [
            {
                "name": "Ken Paulsen",
                "foodOption": "MEAT",
                "dietaryRestrictions": [],
                "other": ""
            },
            {
                "name": "Cathy Paulsen",
                "foodOption": "MEAT",
                "dietaryRestrictions": [],
                "other": "",
            }
        ]
    }
]


export default AdminDashboard;
