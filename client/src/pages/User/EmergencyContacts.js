import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardActions } from "@mui/material";
import ReactMarkdown from "react-markdown";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Drawer, TextField } from "@material-ui/core";
// import Live from '../../components/Live';
import DeleteIcon from '@mui/icons-material/Delete'; 

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

const EmergencyContacts = () => {
  const [open, setOpen] = useState(false);
  const [name, setname] = useState("");
  const [contact, setContact] = useState("");
  const[relationship, setRelationship] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({});
  const [emergencycontacts, setEmergencyContacts] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
      setFormData({
        name,
        contact,
        email,
        relationship,
      });
    };
  
  async function sendBlogToBackend(newuser) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/addEmergencyList`,
        newuser
      );
      toast.success("User Added successfully");
      setOpen(false);
      setname("");
      setContact("");
      setEmail("");
        setRelationship("");

      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteEmergencyContact = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/deleteEmergencyList/${id}`
      );
      toast.success("Emergency Contact Deleted successfully");
      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    async function fetchEmergencyContacts() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getEmergencyList`
        );
        setEmergencyContacts(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEmergencyContacts();
  }, []);


  useEffect(() => {
    console.log(formData);
    if (formData.name && formData.contact && formData.email && formData.relationship) {
      sendBlogToBackend(formData);
    }
  }, [formData]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          padding: "10px",
          width: "100%",
          // border: "2px solid green"
        }}
      >
        <Button
          variant="contained"
  
          onClick={() => setOpen(true)}
          style={{
            margin: "20px",
            backgroundColor: "#68e5ff",
            width: "300px",  
          }}
        >
          <h4 style={{
            color: "black",
          }}>
          Add Emergency Contacts +
          </h4>
        </Button>
      </div>
    <div
        style={{
          width: "100%",
          // border: "1px solid black",
        }}
      >
      </div>

      {/* Drawer for the expert to write a blog */}
      <div>
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        
          <div style={{ padding: "20px", width: "100%", height: "100vh", background: "#161b22"}}>
          <CloseIcon
                onClick={() => setOpen(false)}
                style={{ cursor: "pointer", float: "right" }}
              />
            <form onSubmit={handleSubmit} style={{
              // border: "2px solid green",
              width: "100%",
              margin: "0 auto",
            }}>

              <Typography variant="h6">Add New Emergency Contact</Typography>
              
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                inputProps={{ style: { color: 'white' } }} // Change text color here
                required
              />
              <TextField
              
                label="Contact No."
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                fullWidth
                multiline
                InputLabelProps={{ style: { color: 'white' } }}
                inputProps={{ style: { color: 'white' } }} // Change text color here
                required
              />

                <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                inputProps={{ style: { color: 'white' } }} // Change text color here
                required
                />
                <TextField
                label="Relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                inputProps={{ style: { color: 'white' } }} // Change text color here
                required
                />

              
              
              <div style={{
                width: "100%",
                margin: "1.5em 0",
                // border: "1px solid red",
                display: "flex",
                justifyContent: "center",
              }}>
              <Button type="submit" variant="contained" style={{
          margin: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#68e5ff",
          color: "black",
          fontWeight: "bold",
        
        }}>
                <h4 style={{color: "black"}}>Submit</h4>
              </Button>
              </div>
            </form>
          </div>
        </Drawer>
      </div>


      <div className="Table">
        <h3 style={{
          margin: "20px",
          // border: "2px solid red",
          textAlign: "center",
        }}>EMERGENCY CONTACTS</h3>
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
          }}>Email</TableCell>
                <TableCell  style={{
             color: "white", 
             textDecoration: "underline",
             fontWeight: "bold", 
          }}>Relationship</TableCell> {/* Add this TableCell for delete action */}
              </TableRow>
            </TableHead>
            <TableBody>
              {emergencycontacts.map(user => (
                <TableRow key={user._id}>
                  <TableCell style={{
                    color: "white",
                  }}>{user.name}</TableCell>
                  <TableCell style={{
                    color: "white",
                  }}>{user.contact}</TableCell>
                  <TableCell style={{
                    color: "white",
                  }}>{user.email}</TableCell>
                  <TableCell style={{
                    color: "white",
                  }}>{user.relationship}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteEmergencyContact(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </div>


    </>
  );
};

const StyledTableContainer = styled(TableContainer)({
  backgroundColor: '#424242', // Dark background color
});

export default EmergencyContacts;
