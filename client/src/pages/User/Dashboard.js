import React from 'react'
import AwesomeToggleSwitch from '../../components/AwesomeToggleSwitch'
import { useState } from 'react'
const UserHome = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  return (
   <>
    
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
   </>
    
  )
}

export default UserHome
