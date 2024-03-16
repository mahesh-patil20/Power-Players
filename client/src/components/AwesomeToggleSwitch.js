import React from 'react';
import Switch from '@mui/material/Switch';

const AwesomeToggleSwitch = ({ checked, onChange }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      color="primary"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#00e676', // customize the color when the switch is on
          '&:hover': {
            backgroundColor: 'rgba(0, 230, 118, 0.08)', // customize hover effect when switch is on
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '65e8fc', // customize the track color when the switch is on
        },
      }}
    />
  );
};

export default AwesomeToggleSwitch;
