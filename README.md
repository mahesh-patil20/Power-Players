# **Title: SecureView**

**Overview**

This project implements a sophisticated intruder detection system leveraging a suite of machine learning models, a React frontend, and a Node.js/MongoDB backend. The system is designed to provide real-time monitoring and risk assessment for enhanced security.

**Key Features**

* **Multi-Model Threat Detection:** Combines the following models for comprehensive protection:
    * Model 1: Door Detection (open, close, semi-open)
    * Model 2: Suspicious Intruder Position Detection
    * Model 3: Facial Recognition (against an authorized personnel database)
    * Model 4: Emotion Detection (happy, angry, disgust, fear, surprise, sad, neutral)
    * Model 5: Weapon Detection (handguns, artillery)

* **Risk Analysis:** Calculates dynamic risk profiles based on weighted inputs from individual models.
* **Intuitive User Interface:** React frontend provides real-time visualization of detected threats and risk levels.
* **Scalable Backend:** Node.js and MongoDB backend ensures robust data handling and flexibility for expansion.

**Dependencies**

* **Node.js** ([https://nodejs.org/](https://nodejs.org/))
* **React** ([https://reactjs.org/](https://reactjs.org/))
* **MongoDB** ([https://www.mongodb.com/](https://www.mongodb.com/))
* **Machine Learning Libraries:**
    * TensorFlow, OpenCV, or similar, depending on your model implementations 

**Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/intruder-detection-system.git
   ```

2. Install dependencies (Frontend):
   ```bash
   cd intruder-detection-system/frontend
   npm install
   ```

3. Install dependencies (Backend):
   ```bash
   cd intruder-detection-system/backend
   npm install
   ```

**Configuration**

1. **Database Setup:**
    * Start a MongoDB instance.
    * In `backend/config.js` (or relevant config file), update the database connection string.

2. **Model Integration:**
    * Place your pre-trained models in the designated `backend/models` directory.
    * Update model paths in the backend code as needed.

**Running the System**

1. **Start Backend Server:**
   ```bash
   cd intruder-detection-system/backend
   node server.js 
   ```

2. **Start Frontend Development Server:**
   ```bash
   cd intruder-detection-system/frontend 
   npm start 
   ```

**Contact**

For questions or support, please reach out to mahesh.patil@spit.ac.in akash.panicker@spit.ac.in pranay.singhvi@spit.ac.in udit.rao@spit.ac.in
