import React, { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setBalance } from '../../store/balanceSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

const AccountBalance = (): ReactElement => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const balance = useAppSelector((state) => state.balance.balance)
  // Preventing page refreshes
  useEffect(() => {
    const handleBeforeUnload = async (e: Event) => {
      e.preventDefault()
      e.returnValue = false;
    }

    window.addEventListener('beforeunload',handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  },[])
  
  
  useEffect(() => {
    const fetchAccountBalance = async () => {
      try {
        const response = await fetch('/get-balance', {
          method: 'GET',
          credentials: 'include', // Send cookies with the request
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setBalance({balance: data.balance}))
        } else {
          // Handle the error case
          navigate('/')
        }
      } catch (error) {
        // Handle the error case
        console.log('Error fetching account balance:', error);
      }
    };

    fetchAccountBalance();
  }, []);

  
  // Use the userInfo prop here
  return (
    <div className="content-container">
      <div className="box-layout box-layout__balance container">
        <div className="box-layout__box">
          <label className="balance-label">Your current balance:</label>
          <div className="balance">{balance !== null ? balance : ''}</div>
          <button className="button" onClick={() => navigate('/profile')}>Back</button>
        </div>        
      </div>      
    </div>
  );
};

export default AccountBalance;