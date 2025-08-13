import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="hero">
            <div className="container">
                <div className="hero-content">
                    <br /><br />
                    <h1>With a cancer risk calculator</h1>
                    <p>Check your personal risk and take control of your health with guidance</p>
                    <Link to="/questions" className="btn-custom">Try it now</Link>
                </div>
            </div>
            <div className="features container">
                <div className="feature">
                    <i className="fas fa-clipboard-list"></i>
                    <h3>A comprehensive assessment</h3>
                    <p>Answer a series of questions to assess your unique risk factors.</p>
                </div>
                <div className="feature">
                    <i className="fas fa-chart-line"></i>
                    <h3>Risk analysis</h3>
                    <p>Get an assessment of your cancer risk based on your answers.</p>
                </div>
                <div className="feature">
                    <i className="fas fa-user-md"></i>
                    <h3>Personal guidance</h3>
                    <p>Get customized recommendations to improve your health and reduce risk.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
