import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';
import showdown from 'showdown';

const Guidance: React.FC = () => {
    const [guidance, setGuidance] = useState('');
    const [loading, setLoading] = useState(false);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;

    useEffect(() => {
        const getPersonalizedGuidance = async () => {
            setLoading(true);
            const riskAssessment = localStorage.getItem('risk_assessment');
            const userAnswers = localStorage.getItem('user_answers');

            if (!riskAssessment || !userAnswers) {
                navigate('/questions');
                return;
            }

            let prompt = `You are an AI that provides highly personalized health advice to reduce cancer risk.
Based on the user's specific cancer risk assessment, their detailed answers, and the identified risk factors,
create a comprehensive and actionable health plan that is truly personalized.
For low-risk users, suggest activities that maintain or improve their good habits, and provide encouragement.
For moderate-risk users, suggest actionable changes in diet, lifestyle, and screenings, with a focus on preventing escalation.
For high-risk users, give detailed, specific advice tailored to their unique situation. This includes targeted lifestyle changes, precise dietary advice,
and urgent recommendations for further screenings or consultations. Acknowledge positive actions they are already taking.
Avoid general suggestions; instead, focus on practical steps they can directly implement. Be supportive and avoid creating undue fear, but be clear about the importance of the advice.
Use simple and easy words that can be understood by a 10-year-old child. Minimize grammatical mistakes. Make sure the guidance is clear, actionable, and highly personalized.
If the user has a high-risk chance, give them deeper and better guidance to improve their health.
Generate the response in English.
Start the response with the cancer risk stage and percentage.
Cancer Risk: ${riskAssessment}
User Answers: ${userAnswers}`;

            if (language === 'gu') {
                prompt += "\n\nTranslate the guidance to Gujarati.";
            }

            try {
                const response = await axios.post(GEMINI_API_URL, {
                    "contents": [{ "parts": [{ "text": prompt }] }]
                });
                const guidanceText = response.data.candidates[0].content.parts[0].text;
                const converter = new showdown.Converter();
                const htmlContent = converter.makeHtml(guidanceText);
                setGuidance(htmlContent);
                localStorage.setItem('personalized_guidance', guidanceText);
            } catch (error) {
                console.error('Error:', error);
                alert('Error loading guide. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const personalizedGuidance = localStorage.getItem('personalized_guidance');
        if (personalizedGuidance) {
            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(personalizedGuidance);
            setGuidance(htmlContent);
        } else {
            getPersonalizedGuidance();
        }
    }, [language, GEMINI_API_URL, navigate]);

    return (
        <div className="hero">
            <div className="container">
                <div className="hero-content">
                    <h1>Your personal health guide</h1>
                    <p>Tailored guidance based on answers to your questions and personal information</p>
                </div>
            </div>
            <div className="container">
                {loading ? (
                    <div className="loading" style={{ display: 'block' }}>
                        <div className="loading-content">
                            <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div id="guidance-container" className="guidance-content" dangerouslySetInnerHTML={{ __html: guidance }}></div>
                )}
            </div>
        </div>
    );
};

export default Guidance;
