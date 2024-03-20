import React from 'react';
import Vote from '../Vote/Vote';
import Quote from '../Quote/Quote';
import './QuoteItem.css';

export interface Props {
  id: number;
  author: string;
  text: string;
  positiveVotes: number;
  negativeVotes: number;
  interactionType: number;
}

const QuoteItem: React.FC<Props> = ({ id, author, text, positiveVotes, negativeVotes, interactionType }) => (
  <div className="quote-item-container">
    <Vote id={id} initialPositiveVote={positiveVotes} initialNegativeVote={negativeVotes} interactionType={interactionType} />
    <Quote author={author} text={text} />
  </div>
);

export default QuoteItem;
