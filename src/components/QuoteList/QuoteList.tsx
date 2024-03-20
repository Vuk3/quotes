import React, { useState, useEffect } from 'react';
import QuoteItem from '../QuoteItem/QuoteItem';
import axios from 'axios';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Props as ITag } from '../Tag/Tag'; // Uvoz interfejsa sa pseudonimom
import { Props as IQuote } from '../QuoteItem/QuoteItem'; // Uvoz interfejsa sa pseudonimom
import './QuoteList.css';


interface Interaction {
  postId: number;
  interactionType: number;
}

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('default');
  const pageSize = 5;


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //ovo za quote ako se promeni sort da se vraca ili na prvu stranicu ako ima quotova, ili na 0 ako ih nema
    if (quotes.length == 0) {
      setPage(0)
    }
    else {
      setPage(1)
    }
    setSelectedOption(event.target.value);
  };

  const getLeftCursor = () => {
    if (page <= 1) {
      return "cursor-not-allowed";
    } else {
      return "cursor-pointer";
    }
  };

  const getRightCursor = () => {
    if (page === totalPages) {
      return "cursor-not-allowed";
    } else {
      return "cursor-pointer";
    }
  };

  const handleLeft = async () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleRight = async () => {
    if (page != totalPages) {
      setPage(page + 1);
    }
  };

  const fetchInteractions = async () => {
    try {
      const response = await axios.get(`https://localhost:7137/api/UserInteractions/GetUserInteractions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('No data received');
      }
      setInteractions(response.data);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const response = await axios.get(`https://localhost:7137/api/Quotes/GetQuotes`, {
        params: {
          page: page,
          pageSize: pageSize,
          sort: selectedOption,
          tags: selectedTags.join(',')
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('No data received');
      }
      setQuotes(response.data.quotes);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(`https://localhost:7137/api/Tags/GetAllTags`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('No data received');
      }

      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };


  useEffect(() => {
    fetchQuotes();
  }, [page, selectedTags, selectedOption]);

  useEffect(() => {
    fetchTags();
    fetchInteractions();
  }, []);

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tagName = event.target.value;
    if (event.target.checked) {
      setSelectedTags([...selectedTags, tagName]);
    } else {
      setSelectedTags(selectedTags.filter(tag => tag !== tagName));
    }
  };


  return (
    <div>
      <h1>Quotes</h1>
      <h2>Tags:</h2>
      <div>
        {tags.map(tag => (
          <label key={tag.id} className="tag-container">
            <input
              type="checkbox"
              value={tag.value}
              onChange={handleTagChange}
              checked={selectedTags.includes(tag.value)}
            />
            {tag.value}
          </label>
        ))}
      </div>
      <div>
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="default">Default</option>
          <option value="asc">Average Rating Ascending</option>
          <option value="desc">Average Rating Descending</option>
        </select>
      </div>
      <ul className="quotes-list">
        {quotes.map(({ id, author, text, positiveVotes, negativeVotes }) => {
          const interaction = interactions.find(interaction => interaction.postId === id);
          let interactionType = 0;
          if (interaction) {
            interactionType = interaction.interactionType;
          } return (

            <li key={id}>
              <QuoteItem
                id={id}
                author={author}
                text={text}
                positiveVotes={positiveVotes}
                negativeVotes={negativeVotes}
                interactionType={interactionType}
              />
            </li>
          )
        }
        )}
      </ul>
      <div>
        <FontAwesomeIcon icon={faCaretLeft} className={`${getLeftCursor()}`} onClick={() => handleLeft()} />
        <div className="pages-and-total-pages">{page} / {totalPages}</div>
        <FontAwesomeIcon icon={faCaretRight} className={`${getRightCursor()}`} onClick={() => handleRight()} />
      </div>
    </div>
  );
};

export default QuoteList;
