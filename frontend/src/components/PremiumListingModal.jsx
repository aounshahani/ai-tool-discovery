import React, { useState } from 'react';
import { X, Check, CreditCard } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';

const PremiumListingModal = ({ tool, onClose }) => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(30);

    const pricing = [
        { days: 7, price: 5000, label: "1 Week" },
        { days: 30, price: 15000, label: "1 Month", popular: true },
        { days: 90, price: 40000, label: "3 Months", discount: "Save 11%" }
    ];

    const handlePurchase = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/payments/checkout', {
                toolId: tool._id,
                duration: selectedDuration
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Redirect to Stripe Checkout
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to initiate checkout. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Promote {tool.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-purple-900 mb-2">Why Feature Your Tool?</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-purple-800">
                                <Check size={16} /> Top placement on homepage & category pages
                            </li>
                            <li className="flex items-center gap-2 text-sm text-purple-800">
                                <Check size={16} /> 3x more views and clicks on average
                            </li>
                            <li className="flex items-center gap-2 text-sm text-purple-800">
                                <Check size={16} /> "Featured" badge on your listing
                            </li>
                        </ul>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-4">Select Duration</h3>
                    <div className="space-y-3 mb-8">
                        {pricing.map((option) => (
                            <div
                                key={option.days}
                                onClick={() => setSelectedDuration(option.days)}
                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedDuration === option.days
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-200'
                                    }`}
                            >
                                {option.popular && (
                                    <span className="absolute -top-3 right-4 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                        Most Popular
                                    </span>
                                )}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-gray-900">{option.label}</span>
                                        {option.discount && (
                                            <span className="ml-2 text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                                                {option.discount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">
                                        PKR {option.price.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handlePurchase}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <CreditCard size={20} />
                                Proceed to Payment
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        Secure payment via Stripe. You can cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PremiumListingModal;
