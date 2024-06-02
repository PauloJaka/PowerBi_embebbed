# PowerBi_embebbed
This project is an example of how to integrate Power BI into a web application using Node.js, Express, and other dependencies. This guide will help you set up and run the project in your local environment.

# Requirements
Node.js (version 14 or higher)  
npm (version 6 or higher)

# Project Setup
Step 1: Clone the Repository
Clone the repository to your local environment using the command: git clone or copy the repository URL and use it with your Git client.

Environment Setup
Create a .env file (remember to install with npm install dotenv), or replace the variables in Controller/index.js with your credentials.



# Run the project
1. Install dependencies with npm install.
2. Start the application with npm start.
3. change the values on groupID and reportID to fit your project on http://localhost:3000/report/:groupID/:reportID
4. Change the values in view/index.ejs in the filter section as well, or simply comment out that part of the code. Otherwise, the values will either appear blank or not show up at all.
5. To run again, use node app.js.
