import React, { useState, useEffect } from 'react';
import { getCardsByUserId } from '../services/api';

function BeneficiaryCard({ userId }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (userId) {
      getCardsByUserId(userId)
        .then(res => setCards(res.data))
        .catch(err => console.log('Error fetching user cards'));
    }
  }, [userId]);

  if (cards.length === 0) return <p>No ration card found for this user.</p>;

  return (
    <div style={{ padding: '20px', border: '1px dotted #666', marginTop: '10px' }}>
      <h4>My Ration Card Details</h4>
      {cards.map(card => (
        <div key={card.id} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff' }}>
          <p><strong>Card Number:</strong> {card.cardNumber}</p>
          <p><strong>Type:</strong> {card.cardType}</p>
          <p><strong>Family Size:</strong> {card.familySize}</p>
          <p><strong>Status:</strong> 
            <span style={{ 
              marginLeft: '10px',
              backgroundColor: card.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
              padding: '2px 8px',
              borderRadius: '5px'
            }}>
              {card.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default BeneficiaryCard;
