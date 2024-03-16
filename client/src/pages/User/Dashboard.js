import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import Live from '../../components/Live';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { toast } from "react-toastify";
import Switch from '@mui/material/Switch';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  IconButton,
} from '@mui/material';
import AddAllowedList from './AddAllowedList';
import AwesomeToggleSwitch from '../../components/AwesomeToggleSwitch';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const UserHome = () => {
  const [checked, setChecked] = useState(false);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [intruders, setIntruders] = useState([]);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    localStorage.setItem('systemSecurity', newValue); // Store the value in local storage
    // Call API request based on the toggle state
    if (!checked) {
      // API request for turning ON
      axios.get('http://127.0.0.1:5000/start')
        .then(response => {
          console.log('System turned ON:', response.data);
        })
        .catch(error => {
          console.error('Error turning ON system:', error);
        });
    } else {
      // API request for turning OFF
      axios.get('http://127.0.0.1:5000/stop')
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


  useEffect(() => {
    axios.get('http://localhost:5000/getLatestIntruderImage')
      .then(response => {
       console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching latest intruder image:', error);
      });
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

  const handleDeleteUser = (userId) => {
    // Make an API call to delete the user with userId
    axios.delete(`http://localhost:5000/deleteAllowedList/${userId}`)
      .then(response => {
        console.log('User deleted successfully:', response.data);
        // Update the allowedUsers state after deletion
        setAllowedUsers(allowedUsers.filter(user => user._id !== userId));
        toast.success("User Removed from the Allowed List successfully");
      })
      .catch(error => {
        console.error('Error deleting user:', error);
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

  const handleResetIntruders = () => {
    axios.post('http://localhost:5000/deleteintruders')
      .then(response => {
        console.log('Intruders reset successfully:', response.data);
        // Update the intruders state after reset
        toast.success("Intruders Reset Successfully");
        setIntruders([]);
      })
      .catch(error => {
        console.error('Error resetting intruders:', error);
      });
  };

  return (
    <>
      {/* <Live /> */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: '',
        margin: '20px',
        // border: '2px solid red',
        width: '60%',
        margin : 'auto',
      }}>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        // border: '2px solid red',
      }}>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <div style={{
          textAlign: 'center',
        }}>
        System Security Status
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      
      }}>
        <div>
          OFF
        </div>
        <div>
          {/* <AwesomeToggleSwitch checked={checked} onChange={handleChange} /> */}
          <Switch
      checked={checked}
      onChange={handleChange}
      color="primary"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#00e676', // customize the color when the switch is on
          '&:hover': {
            backgroundColor: 'gray', // customize hover effect when switch is on
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#65e8fc', // customize the track color when the switch is on
        },
      }}
    />
        </div>
        <div>
          ON
        </div>
        </div>
      </div>
      <div>
      <AddAllowedList />
      </div>
      </div>
      
      </div>

      <div className="Table">
        <h3 style={{
          margin: "20px",
          // border: "2px solid red",
          textAlign: "center",
        }}>ALLOWED LIST OF MEMBERS</h3>
        <StyledTableContainer component={Paper} style={{
          width: "50%",
          margin: "auto",
          backgroundColor: "rgb(48, 54, 61, 30)",
        
        }}>
          <Table style={{
            color: "white", 
          }}>
            <TableHead>
              <TableRow>
                <TableCell  style={{
            color: "white", 
            textDecoration: "underline",
            fontWeight: "bold", 
          }}>Image</TableCell>
                <TableCell  style={{
             color: "white", 
             textDecoration: "underline",
             fontWeight: "bold", 
          }}>Name</TableCell>
                <TableCell  style={{
             color: "white", 
             textDecoration: "underline",
             fontWeight: "bold", 
          }}>Contact No.</TableCell>
                <TableCell  style={{
             color: "white", 
             textDecoration: "underline",
             fontWeight: "bold", 
          }}>Action</TableCell> {/* Add this TableCell for delete action */}
              </TableRow>
            </TableHead>
            <TableBody>
              {allowedUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>
                    <StyledAvatar alt={user.name} src={user.image} />
                  </TableCell>
                  <TableCell style={{
                    color: "white",
                  }}>{user.name}</TableCell>
                  <TableCell style={{
                    color: "white",
                  }}>{user.contact}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteUser(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </div>

      <div className="Table">
        <div>
        <h3 style={{
          margin: "20px",
          // border: "2px solid red",
          textAlign: "center",
        }}>INTRUDERS</h3>
        </div>
        <StyledTableContainer component={Paper} style={{
          // border: "2px solid red",
          width: "50%",
          margin: "auto",
          backgroundColor: "rgb(48, 54, 61, 30)",
        
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell   style={{
             color: "white", 
             textDecoration: "underline",
             fontWeight: "bold",
             textAlign: "center", 
          }}>Photo</TableCell>
                <TableCell   style={{
             color: "white", 
             textDecoration: "underline",
             fontWeight: "bold",
             textAlign: "center",  
          }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {intruders.map(intruder => (
                <TableRow key={intruder._id}>
                  <TableCell style={{
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",

                  }}>
                    {/* Assuming intruder_image_base64 is the field name */}
                    <img src={blobToObjectURL(base64ToBlob(intruder.intruder_image_base64))} alt="Intruder" />
                  </TableCell>
                  <TableCell style={{
                    color: "white",
                    textAlign: "center", 
                  }}>{intruder.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <Button variant="contained" onClick={handleResetIntruders} style={{
          margin: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#68e5ff",
          color: "black",
          fontWeight: "bold",
        
        }}>Reset Intruders</Button> {/* Add reset button */}
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
