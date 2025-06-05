# Group8
## structure inside backend/src
| Folder | Purpose |
|--------|---------|
| **`config/`** | stores **database connection** and environment variable setup |
| **`models/`** | sefines **MongoDB schemas** using Mongoose |
| **`middleware/`** | houses **authentication & authorization logic** (e.g., JWT middleware) |
| **`controllers/`** | handles **business logic** for API requests (e.g., registering users, creating studies) |
| **`routes/`** | defines **API endpoints** that map to controllers |
| **`utils/`** | stores **helper functions** (e.g., password hashing, JWT handling) |
| **`uploads/`** | temporary file storage for uploaded artifacts (if using local storage) |
| **Root files (`server.js`, `app.js`)** | server setup & API configuration |



## Running the project
This project uses concurrently for ease of testing and running
the backend and frontend at the same time.

### Installation instructions for devs/users
* Go into the frontend-folder (e.g. "cd .\frontend\") and run "npm install".
  Then go into the backend folder and run "npm install" there too.

* In the backend-folder you will also need an ".env"-file at the top, where package.json is (outside "src").
  This file will need to have some lines at least a MONGO_URI and a JWT_SECRET defined, for instance you could use:
    * MONGO_URI=mongodb://localhost:27017/evalio_database
      JWT_SECRET=replaceThisWithOwnSecret
    
    * It's recommended to replace "replaceThisWithOwnSecret" with something of your own though.
      For production it's necessary to replace with something else, preferably longer and more unpredictable.

* (For setting up "concurrently" you can use "npm install concurrently --save-dev"
  in the backend-folder, but this shouldn't be required with
  the "package.json"-files already set up and the "npm install"-commands already run.)

### Running instructions
* Go into the backend-folder (e.g. "cd .\backend\") from the root of the project.
* The use "npm run dev". The "dev"-script runs the server and client
  simultaneously.



## Project authors
* Group 8, consisting of:
    * Mariam
    * Jon Petter
    * Sander
