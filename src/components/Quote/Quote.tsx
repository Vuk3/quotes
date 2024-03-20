import React from 'react';
import './Quote.css'

interface Props {
  author: string;
  text: string;
}

const Quote: React.FC<Props> = ({ author, text }) => (
  <div className="quote-container">
    <div className="quote-text"><p>{text}</p></div>
    <div className="quote-author"><label>— {author}</label></div>
  </div>
);

export default Quote;
