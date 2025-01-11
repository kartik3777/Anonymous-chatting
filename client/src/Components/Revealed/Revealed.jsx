import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Revealed.css';
import { useSelector } from "react-redux";
import Avtar from '../avtar/Avtar'

function Revealed() {
    const Main_user = useSelector((state) => state.user);
  const [acceptedUsers, setAcceptedUsers] = useState([]);

  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const userId = Main_user._id; // Replace with actual user ID logic
        const response = await axios.get(`http://localhost:8000/api/v1/users/getAcceptedUsers/${userId}`);
        setAcceptedUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching accepted users:', error);
      }
    };

    fetchAcceptedUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const currentUserId = Main_user._id; // Replace with actual user ID logic
      await axios.post(`http://localhost:8000/api/v1/users/removeAccepted`, {
        userId: currentUserId,
        acceptedUserId: userId,
      });

      // Update state to remove user from the list
      setAcceptedUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert('User removed from accepted list!');
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  return (
    <div className="rev-out">
      <h3>Who Can See Your Identity</h3>
      {acceptedUsers.length === 0 ? (
        <p>No users in the accepted list.</p>
      ) : (
        <table className="revealed-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {acceptedUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.profile || 'default-profile.png'} // Default profile image if not provided
                    alt="Profile"
                    className="profile-img"
                  />
                  {/* <Avtar profile={user.profile} size="55px" /> */}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.branch}</td>
                <td>{user.gender}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Revealed;

