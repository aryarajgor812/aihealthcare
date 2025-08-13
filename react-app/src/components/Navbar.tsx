import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
    const { language, setLanguage } = useContext(LanguageContext);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'en' | 'gu');
        location.reload();
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/questions">Try Now</Link></li>
                <li><Link to="/guidance">Guidance</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
                <li>
                    <select id="language-selector" value={language} onChange={handleLanguageChange}>
                        <option value="en">English</option>
                        <option value="gu">Gujarati</option>
                    </select>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
