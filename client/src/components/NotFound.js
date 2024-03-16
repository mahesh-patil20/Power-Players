import React from 'react';
import { Box, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import notfound from "../assets/homepage/notfound.png"

const primary = purple[500];

const NotFound = () => {
  return (
    <div style={{margin: "0 auto",
      width: "900px",
      height: "auto"}}>
    {/* <h1>404!</h1>
    <h1>Sorry, No such page found</h1> */}
    <img style={{
      maxWidth: "100%",
      height: "auto"
    }} src={notfound} alt="404 Not Found" />
    </div>
  )
}

export default NotFound
