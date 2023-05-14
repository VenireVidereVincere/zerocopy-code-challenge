import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { setUserDetails } from '../../store/userSlice';
import '../../src/public/assets/default_profile_pic.jpg'

const UserProfile = (): ReactElement => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Hydrate the store in case the user refreshed the webpage.
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          credentials: "include" 
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch user information");
        }
  
        const userDetails = await response.json();
        return userDetails;
      } catch (error) {
        console.error(error);
        return {}; // Handle the error case, e.g., display an error message or redirect the user
      }
    };
  
    const fetchData = async () => {
      const userData = await getUserData();
      dispatch(setUserDetails(userData));
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    if(Object.keys(userDetails).length === 0){
      navigate('/')
    }
  })
  
  useEffect(() => {
    const handleBeforeUnload = async (e: Event) => {
      e.preventDefault()
      e.returnValue = false;  
      navigate('/profile')
    }

    window.addEventListener('beforeunload',handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  },[])

  const handleLogout = () => {
    fetch('/logout', {
      method: 'POST',
      credentials: 'include', // Include credentials (cookies) in the request
    })
      .then((response) => {
        if (response.ok) {
          navigate('/')
        } else {
          console.log('Logout failed');
          // Handle logout failure or error
        }
      })
      .catch((error) => {
        console.error('Error occurred during logout', error);
        // Handle error that occurred during logout
      });
  };
  // Use the userInfo prop here
  const userDetails = useAppSelector((state) => state.userInfo.user);

  return (
    <div className="content-container">
      <div className="profile-container">
        <div className="container">
          <div className="profile-picture-container">
            <img 
              className="responsive-image" 
              src={userDetails.picture} alt="Profile Picture" 
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = '/src/public/assets/default_profile_pic.jpg';
              }}
              />
          </div>
          <div className="button-container">
            <button className="button"onClick={() => navigate('/balance')}>BALANCE</button>
            <button className="button" onClick={() => navigate('/update-profile')}>EDIT</button>            
          </div>
        </div>

        <div className="container container__bottom">
          <div className="name-container">
            <h2>{userDetails.name?.first} {userDetails.name?.last}</h2>
          </div>
          <ul className="ul-element">
            <li><strong>EMAIL:</strong> {userDetails.email}</li>
            <li><strong>ADDRESS:</strong> {userDetails.address}</li>
            <li><strong>AGE:</strong> {userDetails.age}</li>
            <li><strong>PHONE:</strong> {userDetails.phone}</li>
          </ul>
        </div>
        <div className="button-container">
          <button className="button" onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
   </div>
  );
};

export default UserProfile;