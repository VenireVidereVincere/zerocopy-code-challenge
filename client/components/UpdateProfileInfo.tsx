import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { updateUserDetails } from '../../store/userSlice';

const UpdateInfoPage = (): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleBeforeUnload = (e: Event) => {
      e.preventDefault();
      e.returnValue = false;
      navigate('/profile');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if(Object.keys(userDetails).length === 0){
      navigate('/')
    }
  })

  const userDetails = useAppSelector((state) => state.userInfo.user);  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name.startsWith('name.')) {
      const fieldName = name.split('.')[1];
      dispatch(updateUserDetails({
        name: {
          ...userDetails.name,
          [fieldName]: value
        }
      }));
    } else {
      dispatch(updateUserDetails({ [name]: value }));
    }
  };

  const handleConfirm = () => {
    const { name, email, phone, address } = userDetails;


    // Validate required fields
    if (
      email!!.trim() === '' ||
      name!!.first.trim() === '' ||
      name!!.last.trim() === '' ||
      phone!!.trim() === '' ||
      address!!.trim() === ''
    ) {
        console.log("Fields can't be empty")
        // Handle empty email
        return;
      }

    const emailRegex = /^\S+@\S+\.\S+$/; // Basic email validation regex
    if (!emailRegex.test(email!!)) {
      console.log("Invalid email address.")
      // Handle invalid email
      return;
    }
  


    fetch('/user', {
      method: 'PUT',
      credentials: 'include', // Include credentials from HTTP-only cookie
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, address }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('User details updated:', response);
        // After having updated the information from the user on the DB
        // We call the handleCancel handler to rehydrate the store and navigate 
        // back to the profile
        handleCancel()
      })
      .catch((error) => {
        console.error('Error updating user details:', error);
      });
  };

  const handleCancel = () => {
    fetch('/user', {
      method: 'GET',
      credentials: 'include', // Include credentials from HTTP-only cookie
    })
      .then((response) => response.json())
      .then((userDetails) => {
        dispatch(updateUserDetails(userDetails)); // Dispatch user details from server to update the store
        navigate('/profile'); // Navigate to the profile page
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  };

  return (
    <div className='content-container'>
      <div className="profile-container">
        <label className="info-label">
            First Name:
            <input
              className='textbox textbox__edit-profile'
              type="text"
              name="name.first"
              value={userDetails.name?.first || ''}
              onChange={handleInputChange}
            />
        </label>
        <label className="info-label"> 
          Last Name:
          <input
            className='textbox textbox__edit-profile'
            type="text"
            name="name.last"
            value={userDetails.name?.last || ''}
            onChange={handleInputChange}
          />
        </label>
        <label className="info-label">
          Email:
          <input
            className='textbox textbox__edit-profile'
            type="text"
            name="email"
            value={userDetails.email || ''}
            onChange={handleInputChange}
          />
        </label>
        <label className="info-label">
          Phone:
          <input
            className='textbox textbox__edit-profile'
            type="text"
            name="phone"
            value={userDetails.phone || ''}
            onChange={handleInputChange}
          />
        </label>

        <div className="button-container button-container__edit-profile">
          <button className="button" onClick={handleConfirm}>Confirm</button>
          <button className="button" onClick={handleCancel}>Cancel</button>
        </div>

      </div>

    </div>
  );
};

export default UpdateInfoPage;