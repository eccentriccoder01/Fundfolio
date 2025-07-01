import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Remaining = () => {
    const { remaining, currency, budgetStatus, budget } = useContext(AppContext);
    
    const getStatusIcon = () => {
        switch (budgetStatus) {
            case 'over': return '🚨';
            case 'critical': return '⚠️';
            case 'warning': return '⚡';
            default: return '✅';
        }
    };
    
    const getStatusText = () => {
        switch (budgetStatus) {
            case 'over': return 'Over Budget!';
            case 'critical': return 'Critical Level';
            case 'warning': return 'Approaching Limit';
            default: return 'Healthy Budget';
        }
    };
    
    const getCardClass = () => {
        switch (budgetStatus) {
            case 'over': return 'stats-card danger';
            case 'critical': return 'stats-card danger';
            case 'warning': return 'stats-card';
            default: return 'stats-card remaining';
        }
    };

    return (
        <div className={getCardClass()}>
            <div className='card-header'>
                <div className='card-title'>Remaining Budget</div>
                <div className='card-icon' style={{
                    background: budgetStatus === 'over' || budgetStatus === 'critical' 
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}>
                    {getStatusIcon()}
                </div>
            </div>
            
            <div className='card-value' style={{
                color: budgetStatus === 'over' ? '#ef4444' : '#1e293b'
            }}>
                {currency}{Math.abs(remaining).toLocaleString()}
            </div>
            
            <div className='card-description'>
                {getStatusText()} • {remaining < 0 ? 'Overspent' : 'Available'}
            </div>
            
            {remaining < 0 && (
                <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: '#fef2f2',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: '#dc2626',
                    fontWeight: '600'
                }}>
                    Exceeds budget by {currency}{Math.abs(remaining).toLocaleString()}
                </div>
            )}
        </div>
    );
};

export default Remaining;