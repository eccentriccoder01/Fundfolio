import React, { useContext, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import { AppContext } from '../context/AppContext';

const ExpenseList = () => {
    const { expenses, currency } = useContext(AppContext);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterValue, setFilterValue] = useState('');

    const sortedAndFilteredExpenses = expenses
        .filter(expense => 
            expense.name.toLowerCase().includes(filterValue.toLowerCase())
        )
        .sort((a, b) => {
            let aValue = sortBy === 'name' ? a.name : a.cost;
            let bValue = sortBy === 'name' ? b.name : b.cost;
            
            if (sortBy === 'name') {
                return sortOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const totalAllocated = expenses.reduce((sum, expense) => sum + expense.cost, 0);

    if (expenses.length === 0) {
        return (
            <div className='empty-state'>
                <div className='empty-state-icon'>🏢</div>
                <h3>No Departments Added</h3>
                <p>Add your first department to start managing allocations</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="form-input"
                        style={{minWidth: '200px'}}
                    />
                    <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        fontWeight: '500'
                    }}>
                        {sortedAndFilteredExpenses.length} of {expenses.length} departments
                    </div>
                </div>
                
                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                }}>
                    Total: {currency}{totalAllocated.toLocaleString()}
                </div>
            </div>

            <table className='modern-table'>
                <thead>
                    <tr>
                        <th 
                            onClick={() => handleSort('name')}
                            style={{cursor: 'pointer', userSelect: 'none'}}
                        >
                            Department {getSortIcon('name')}
                        </th>
                        <th 
                            onClick={() => handleSort('cost')}
                            style={{cursor: 'pointer', userSelect: 'none'}}
                        >
                            Allocated Budget {getSortIcon('cost')}
                        </th>
                        <th>Actions</th>
                        <th>Quick Adjust</th>
                        <th>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAndFilteredExpenses.map((expense) => (
                        <ExpenseItem
                            key={expense.id}
                            id={expense.id}
                            name={expense.name}
                            cost={expense.cost}
                            currency={currency}
                            color={expense.color}
                            icon={expense.icon}
                        />
                    ))}
                </tbody>
            </table>

            {filterValue && sortedAndFilteredExpenses.length === 0 && (
                <div className='empty-state'>
                    <div className='empty-state-icon'>🔍</div>
                    <h3>No departments found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;