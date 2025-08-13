import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const Questions: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;

    useEffect(() => {
        const generateQuestions = async () => {
            setLoading(true);
            let prompt = "You are an AI specialized in asking health-related questions to assess cancer risk. Your task is to create a series of personalized and easy-to-understand questions to learn about the user's habits, lifestyle, medical history, and environmental exposures. Think of these questions as something a friendly and empathetic doctor would ask. Make sure the questions are straightforward and personalized. Use simple and easy words that can be understood by a 10-year-old child. Minimize grammatical mistakes. Make sure the questions are detailed and clear. The questions should be divided into four stages: 1. **Basic Information:** Gather essential details like age, gender, location, and race/ethnicity, with options where appropriate. 2. **Health Habits:** Explore critical health behaviors, including smoking, alcohol consumption, diet, physical activity, and sleep patterns. 3. **Specific Risks:** Ask about family medical history, previous diagnoses, exposure to harmful substances (e.g., radiation, carcinogens), stress levels, and any chronic conditions. 4. **Screening and Diagnostic Tests:** Inquire about results from previous cancer screenings, findings from imaging tests (e.g., mammograms, colonoscopies), and relevant biomarker levels. Provide options only where it makes sense (like for age, gender, etc.), and use open-ended questions for more detailed responses (like lifestyle or medical history). Also, ask for the user's name to personalize the interaction. Format the response in JSON without markdown. Structure it like this: {questions: [{question: \"What is your age?\", \"type\": \"open-ended\"}, {question: \"What is your gender?\", options: [\"Male\", \"Female\", \"Other\"], \"type\": \"single-choice\"}]}";

            if (language === 'gu') {
                prompt += "\n\nTranslate the questions and options to Gujarati.";
            }

            try {
                const response = await axios.post(GEMINI_API_URL, {
                    "contents": [{
                        "parts": [{
                            "text": prompt
                        }]
                    }]
                });
                const responseText = response.data.candidates[0].content.parts[0].text;
                const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                setQuestions(JSON.parse(cleanedJsonString).questions);
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while loading questions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        generateQuestions();
    }, [language, GEMINI_API_URL]);

    const handleAnswerSubmit = async () => {
        let answer;
        const currentQuestion = questions[questionIndex];

        if (currentQuestion.options && currentQuestion.options.length > 0) {
            const selectedOptions: string[] = [];
            document.querySelectorAll<HTMLInputElement>('input[name="answer"]:checked').forEach((el) => {
                selectedOptions.push(el.value);
            });

            if (selectedOptions.length > 0) {
                answer = selectedOptions;
            } else {
                alert("Please select an option before proceeding.");
                return;
            }
        } else {
            answer = (document.getElementById('answer') as HTMLInputElement).value;
            if (!answer) {
                alert("Please reply before proceeding.");
                return;
            }
        }

        const newAnswers = [...answers, { question: currentQuestion.question, answer: answer }];
        setAnswers(newAnswers);

        if (questionIndex < questions.length - 1) {
            setQuestionIndex(questionIndex + 1);
        } else {
            setLoading(true);

            let summarizePrompt = `You are an AI specialized in summarizing user-provided health information to generate a concise, easy-to-understand summary.
Based on the user's responses to health-related questions, create a short summary that highlights the most important details about their habits, lifestyle, medical history, and cancer risk factors.
The summary should be informative but concise, covering key aspects such as age, gender, health habits, specific risks, and any previous screenings or diagnostic test results.
Use simple and easy words that can be understood by a 10-year-old child. Minimize grammatical mistakes. Make sure the summary is clear and accurate.
Generate the response in English. User Answers: ${JSON.stringify(newAnswers)}`;

            if (language === 'gu') {
                summarizePrompt += "\n\nTranslate the summary to Gujarati.";
            }

            try {
                const summarizeResponse = await axios.post(GEMINI_API_URL, {
                    "contents": [{ "parts": [{ "text": summarizePrompt }] }]
                });
                const summary = summarizeResponse.data.candidates[0].content.parts[0].text;
                localStorage.setItem('user_summary', summary);

                let riskPrompt = `You are an AI specialized in accurately assessing cancer risk based on a wide range of detailed user responses.
Your role is to carefully analyze the user's answers concerning their habits, lifestyle, medical history, environmental exposures, and diagnostic test results.
Consider genetic factors, lifestyle choices, demographic characteristics, environmental exposures, and results from screenings or diagnostic tests.
Provide a nuanced risk level (very low, low, moderate, high, very high) with a precise percentage, ranging from 1% to 100%.
The risk level and percentage should accurately reflect the user's responses, with each factor carefully weighed.
If the risk is high or very high, give special attention to the seriousness of the situation but do so in a balanced and supportive manner.
Use simple and easy words that can be understood by a 10-year-old child. Minimize grammatical mistakes. Make sure the explanation is detailed, accurate, and clear.
Generate the response in English.
Begin the response with the cancer risk level and percentage. User Answers: ${JSON.stringify(newAnswers)}`;

                if (language === 'gu') {
                    riskPrompt += "\n\nTranslate the risk assessment to Gujarati.";
                }

                const riskResponse = await axios.post(GEMINI_API_URL, {
                    "contents": [{ "parts": [{ "text": riskPrompt }] }]
                });
                const riskAssessment = riskResponse.data.candidates[0].content.parts[0].text;
                localStorage.setItem('risk_assessment', riskAssessment);
                localStorage.setItem('user_answers', JSON.stringify(newAnswers));
                navigate('/guidance');
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while making an API call. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="hero">
            <div className="container">
                <div className="hero-content">
                    <h1>Cancer risk calculator</h1>
                    <p>Answer the following questions to assess your personal risk</p>
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
                    questions.length > 0 && questionIndex < questions.length && (
                        <div id="question-container" className="question-card">
                            <h4>{questions[questionIndex].question}</h4>
                            {questions[questionIndex].options ? (
                                <ul className="options-list">
                                    {questions[questionIndex].options.map((option: string, index: number) => (
                                        <li key={index}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type={questions[questionIndex].type === 'multiple-choice' ? 'checkbox' : 'radio'}
                                                    name="answer"
                                                    id={`option-${index}`}
                                                    value={option}
                                                />
                                                <label className="form-check-label" htmlFor={`option-${index}`}>{option}</label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <input type="text" id="answer" className="form-control" />
                            )}
                            <button className="btn-custom mt-3" onClick={handleAnswerSubmit}>Next</button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Questions;
