import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Currency = () => {
    const { currency, dispatch } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);

    const currencies = [
        { symbol: '£', name: 'British Pound', code: 'GBP', flag: '🇬🇧' },
        { symbol: '$', name: 'US Dollar', code: 'USD', flag: '🇺🇸' },
        { symbol: '€', name: 'Euro', code: 'EUR', flag: '🇪🇺' },
        { symbol: '¥', name: 'Japanese Yen', code: 'JPY', flag: '🇯🇵' },
        { symbol: '₹', name: 'Indian Rupee', code: 'INR', flag: '🇮🇳' },
        { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD', flag: '🇨🇦' }
    ];

    const currentCurrency = currencies.find(c => c.symbol === currency) || currencies[0];

    const handleCurrencyChange = (newCurrency) => {
        dispatch({
            type: 'CHG_CURRENCY',
            payload: newCurrency.symbol
        });
        setIsOpen(false);
    };

    return (
        <div className='stats-card' style={{ position: 'relative', overflow: 'visible', zIndex: 1 }}>
            <div className='card-header'>
                <div className='card-title'>Currency</div>
                <div className='card-icon' style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #FBF5B7, #AA771C)' }}>
                    💱
                </div>
            </div>

            <div className='card-value' style={{ fontSize: '1.5rem' }}>
                {currentCurrency.flag} {currentCurrency.symbol}
            </div>

            <div className='card-description'>
                {currentCurrency.name} ({currentCurrency.code})
            </div>

            <div style={{ marginTop: '1rem', position: 'relative' }}>
                <button
                    className='primary-btn'
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: "100%",
                        fontSize: "0.75rem",
                        padding: "0.5rem",
                        height: "100%",
                        position: "relative",
                        zIndex: 20,
                        overflow: "visible"
                    }}
                >
                    Change Currency
                </button>

                {isOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '2px solid var(--border-color)',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-lg)',
                            zIndex: 1000,
                            marginTop: '0.5rem'
                        }}
                    >
                        {currencies.map((curr) => (
                            <button
                                key={curr.code}
                                onClick={() => handleCurrencyChange(curr)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: 'none',
                                    background: curr.symbol === currency ? '#f1f5f9' : 'transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    borderRadius:
                                        curr === currencies[0]
                                            ? '10px 10px 0 0'
                                            : curr === currencies[currencies.length - 1]
                                                ? '0 0 10px 10px'
                                                : '0'
                                }}
                                onMouseEnter={(e) => (e.target.style.background = '#f8fafc')}
                                onMouseLeave={(e) =>
                                (e.target.style.background =
                                    curr.symbol === currency ? '#f1f5f9' : 'transparent')
                                }
                            >
                                {curr.flag} {curr.symbol} {curr.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default Currency;