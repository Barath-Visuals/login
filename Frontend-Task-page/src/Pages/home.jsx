import React from 'react';
import { useEffect, useState } from 'react';

export default function Home({ user, onLogout }) {
    const [localUser, setLocalUser] = useState(user);

    // Use `localUser` in your component
    return (
        <div>
            <h1>Welcome, {localUser?.name}</h1>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}


