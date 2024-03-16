import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardActions } from "@mui/material";
import ReactMarkdown from "react-markdown";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Drawer, TextField } from "@material-ui/core";

const AddAllowedList = () => {
  const [open, setOpen] = useState(false);
  const [name, setname] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState(null); // For handling image upload
  const [formData, setFormData] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.readAsDataURL(image); // Convert image to base64 string
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setFormData({
        name,
        contact,
        image: base64Image,
      });
    };
  };

  async function sendBlogToBackend(newuser) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/addAllowedList`,
        newuser
      );
      toast.success("User Added successfully");
      setOpen(false);
      setname("");
      setContact("");
      setImage(null);
      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(formData);
    if (formData.name && formData.contact && formData.image) {
      sendBlogToBackend(formData);
    }
  }, [formData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          padding: "10px",
          color: "white"
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Allowed Member +
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

              <Typography variant="h6">Add New Allowed Member</Typography>
              
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
              
              <div style={{
                width: "100%",
                margin: "1.5em 0"
              }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              </div>
              <div style={{
                width: "100%",
                margin: "1.5em 0",
                // border: "1px solid red",
                display: "flex",
                justifyContent: "center",
              }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              </div>
            </form>
          </div>
        </Drawer>
      </div>

    </>
  );
};

export default AddAllowedList;
