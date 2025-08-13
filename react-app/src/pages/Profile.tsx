import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import showdown from 'showdown';

const Profile: React.FC = () => {
    const [userSummary, setUserSummary] = useState('');
    const [personalizedGuidance, setPersonalizedGuidance] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const summary = localStorage.getItem('user_summary');
        const guidance = localStorage.getItem('personalized_guidance');
        const converter = new showdown.Converter();

        if (summary) {
            setUserSummary(converter.makeHtml(summary));
        } else {
            setUserSummary('<p>Sorry, no user summary available.</p>');
        }

        if (guidance) {
            setPersonalizedGuidance(converter.makeHtml(guidance));
        } else {
            setPersonalizedGuidance('<p>Sorry, personalized guidance is not available.</p>');
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="hero">
            <div className="container">
                <div className="hero-content">
                    <h1>My Profile</h1>
                    <p>Information about me and my health!</p>
                </div>
            </div>
            <div className="container">
                <div className="profile-content">
                    <h2>About Me:</h2>
                    <div id="user-summary" dangerouslySetInnerHTML={{ __html: userSummary }}></div>
                    <h2>Health guidance</h2>
                    <div id="personalized-guidance" dangerouslySetInnerHTML={{ __html: personalizedGuidance }}></div>
                </div>
                <button id="logout-btn" className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Profile;
