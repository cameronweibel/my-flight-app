'use client'

import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WebsitePrototype = () => {
    const [showError, setShowError] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showSeatmap, setShowSeatmap] = useState(false);
    useEffect(() => {
        // Load Cognigy webchat script
        const script = document.createElement('script');
        script.src = 'https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js';
        script.async = true;
        script.onload = () => {
            // Initialize webchat with your endpoint
            window.initWebchat(
                "https://endpoint-trial.cognigy.ai/df60489eae7284806876c8ddf1a4aa3c1b03ed2a6672610f3ece7ea167298492"
            );
        };
        document.body.appendChild(script);

        // Cleanup
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Simulate error after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // Initialize chat and send error context
    const initChat = () => {
        setShowChat(true);
        // Send error context to Cognigy
        if (window.cognigyWebchat) {
            window.cognigyWebchat.sendMessage({
                text: "Error encountered",
                data: {
                    error: "Database connection failed",
                    code: "ERR_DB_CONN"
                }
            });
        }
    };

    // Listen for Cognigy messages
    useEffect(() => {
        const handleCognigyMessage = (event) => {
            // Check if the message is from Cognigy and has the seatmap intent
            if (event.detail?.message?.data?.intent === 'show_seatmap') {
                setShowSeatmap(true);
            }
        };

        // Add event listener for Cognigy messages
        window.addEventListener('cognigy-webchat-message', handleCognigyMessage);

        return () => {
            window.removeEventListener('cognigy-webchat-message', handleCognigyMessage);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className={`flex ${showChat ? 'gap-4' : ''}`}>
                {/* Main content area */}
                <div className={`bg-white rounded-lg shadow p-6 ${showChat ? 'w-2/3' : 'w-full'}`}>
                    <h1 className="text-2xl font-bold mb-4">Flight Booking System</h1>
                    {showError && !showChat && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error: Database connection failed</AlertTitle>
                            <AlertDescription>
                                We're experiencing technical difficulties.
                                <button
                                    onClick={initChat}
                                    className="ml-2 text-blue-600 hover:underline"
                                >
                                    Chat with support
                                </button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {showSeatmap ? (
                        <div className="border-2 border-gray-200 rounded p-4">
                            <h2 className="text-xl font-semibold mb-2">Seat Map</h2>
                            <div className="grid grid-cols-6 gap-2">
                                {[...Array(24)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-blue-100 p-2 text-center rounded"
                                    >
                                        {String.fromCharCode(65 + Math.floor(i / 6))}{i % 6 + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p>Welcome to our flight booking system.</p>
                            <p>Please select your desired flight options below.</p>
                        </div>
                    )}
                </div>

                {/* Cognigy webchat will be automatically positioned here when initialized */}
                {showChat && <div className="w-1/3" id="webchat-container" />}
            </div>
        </div>
    );
};

export default WebsitePrototype;