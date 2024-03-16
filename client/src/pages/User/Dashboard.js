import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Live from '../../components/Live';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from '@mui/material';
import AddAllowedList from './AddAllowedList';
import AwesomeToggleSwitch from '../../components/AwesomeToggleSwitch';
import Avatar from '@mui/material/Avatar';

const UserHome = () => {
  const [checked, setChecked] = useState(localStorage.getItem('systemSecurity'));
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [intruders, setIntruders] = useState([]);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    localStorage.setItem('systemSecurity', newValue); // Store the value in local storage
    // Call API request based on the toggle state
    if (!checked) {
      // API request for turning ON
      axios.get('http://localhost:7000/start')
        .then(response => {
          console.log('System turned ON:', response.data);
        })
        .catch(error => {
          console.error('Error turning ON system:', error);
        });
    } else {
      // API request for turning OFF
      axios.get('http://localhost:7000/stop')
        .then(response => {
          console.log('System turned OFF:', response.data);
        })
        .catch(error => {
          console.error('Error turning OFF system:', error);
        });
    }
  };

  useEffect(() => {
    fetchAllowedUsers();
    fetchIntruders();
    localStorage.setItem('systemSecurity', false); // Store the value in local storage
    // SendEmail('2021-10-10 10:10:10', 'image');
  }, []);

  const SendEmail =  (time, image) => {
    try {
      const response = axios.post('http://localhost:5000/send-email', {
        time,
        image,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  const fetchAllowedUsers = () => {
    axios.get('http://localhost:5000/getAllowedList')
      .then(response => {
        setAllowedUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching allowed users:', error);
      });
  };

  const fetchIntruders = () => {
    axios.get('http://localhost:5000/getIntruders')
      .then(response => {
        setIntruders(response.data);
      })
      .catch(error => {
        console.error('Error fetching intruders:', error);
      });
  };

  useEffect(() => {
    const intruderAddedListener = () => {
      fetchIntruders();
    };

    window.addEventListener('intruderAdded', intruderAddedListener);

    return () => {
      window.removeEventListener('intruderAdded', intruderAddedListener);
    };
  }, []);

  // Function to convert Base64 to Blob
  const base64ToBlob = (base64String) => {
    const byteString = atob(base64String);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpeg' });
  };

  // Function to convert Blob to object URL
  const blobToObjectURL = (blob) => {
    return URL.createObjectURL(blob);
  };

  return (
    <>
      {/* <Live /> */}
      <AddAllowedList />
      <div>
        System Security Status
      </div>
      <div style={{
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          OFF
        </div>
        <div>
          <AwesomeToggleSwitch checked={checked} onChange={handleChange} />
        </div>
        <div>
          ON
        </div>
      </div>

      <div className="Table">
        <h3>ALLOWED LIST OF MEMBERS</h3>
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact No.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allowedUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>
                    <StyledAvatar alt={user.name} src={user.image} />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </div>

      <div className="Table">
        <h3>INTRUDERS</h3>
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {intruders.map(intruder => (
                <TableRow key={intruder._id}>
                  <TableCell>
                    {/* Assuming intruder_image_base64 is the field name */}
                    <img src={blobToObjectURL(base64ToBlob(intruder.intruder_image_base64))} alt="Intruder" />
                  </TableCell>
                  <TableCell>{intruder.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </div>
    </>
  );
}

// Styled components for customizing the table and avatar
const StyledTableContainer = styled(TableContainer)({
  backgroundColor: '#424242', // Dark background color
});

const StyledAvatar = styled(Avatar)({
  width: 50,
  height: 50,
  borderRadius: '50%', // Circular frame
});

export default UserHome;
