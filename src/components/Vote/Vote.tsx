import React, { useEffect, useState } from 'react';
import './Vote.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface Props {
  id: number;
  initialPositiveVote: number;
  initialNegativeVote: number;
  interactionType: number;
}


const calculateColor = (percentage: number): string => {
  const red = percentage < 50 ? 255 : Math.floor(255 - (percentage * 2 - 100) * 255 / 100);
  const green = percentage > 50 ? 255 : Math.floor((percentage * 2) * 255 / 100);
  const blue = 0;
  return `rgb(${red}, ${green}, ${blue})`;
};

const Vote: React.FC<Props> = ({ id, initialPositiveVote, initialNegativeVote, interactionType }) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [positiveVote, setPositiveVote] = useState<number>(initialPositiveVote);
  const [negativeVote, setNegativeVote] = useState<number>(initialNegativeVote);
  const [color, setColor] = useState<string>('');
  const [interaction, setInteraction] = useState<number>(interactionType);

  useEffect(() => {
    setInteraction(interactionType);
  }, [interactionType]);



  const handleLike = async (id: number) => {
    try {
      const response = await axios.post(`https://localhost:7137/api/Quotes/${id}/like`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        setPositiveVote(response.data.positiveVotes);
        setNegativeVote(response.data.negativeVotes);
        if (interaction == 0 || interaction == 2)
          setInteraction(1);
        else {
          setInteraction(0);
        }
      }
    } catch (error) {
      console.error('Error sending like', error);
    }
  };

  const handleDislike = async (id: number) => {
    try {
      const response = await axios.post(`https://localhost:7137/api/Quotes/${id}/dislike`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        setPositiveVote(response.data.positiveVotes);
        setNegativeVote(response.data.negativeVotes);
        if (interaction == 0 || interaction == 1)
          setInteraction(2);
        else {
          setInteraction(0);
        }
      }
    } catch (error) {
      console.error('Error sending dislike', error);
    }
  };

  useEffect(() => {
    const totalVotes = positiveVote + negativeVote;
    const newAverageRating = totalVotes > 0 ? Math.round((positiveVote / totalVotes) * 100) : 0;
    setAverageRating(newAverageRating);
    setColor(calculateColor(newAverageRating))
  }, [positiveVote, negativeVote]);

  return (
    <div className="vote-container">
      <FontAwesomeIcon icon={faCaretUp} className={interaction === 1 ? 'caret-up active cursor-pointer' : 'caret-up cursor-pointer'} onClick={() => handleLike(id)} />
      <div style={{ color: color }}>{averageRating}%</div>
      <div>{positiveVote} / {negativeVote}</div>
      <FontAwesomeIcon icon={faCaretDown} className={interaction === 2 ? 'caret-down active cursor-pointer' : 'caret-down cursor-pointer'} onClick={() => handleDislike(id)} />
    </div>
  );
};

export default Vote;
