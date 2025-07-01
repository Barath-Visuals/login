import React from 'react';
import { useEffect, useState } from 'react';
import Header from "../Components/header.jsx";
import Hero from "../Components/hero.jsx";

export default function Home({ user, onLogout }) {
    const [localUser, setLocalUser] = useState(user);

    // Use `localUser` in your component
    return (
        <>
            <Header/>
            <Hero onLogout={onLogout}/>
            {/* <h1>Welcome, {localUser?.name}</h1> */}
            {/* <button onClick={onLogout}>Logout</button> */}
        </>
    );
}


