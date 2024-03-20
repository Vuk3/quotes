import { useEffect, useState } from 'react';
import './App.css';
import QuoteList from './components/QuoteList/QuoteList';
import axios from 'axios';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await axios.get('https://localhost:7137/api/Authorize/IsAuthorized', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (response.status === 200) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Unauthorized access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthorized ? (
        <QuoteList />
      ) : (
        <div>401 Unauthorized</div>
      )}
    </div>
  );
}

export default App;