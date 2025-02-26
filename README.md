# SearchCpfFromPdf

## Requisitos do projeto
**Simple Single-Page Application** that:
1. **Uploads a PDF** to the frontend.
2. **Processes the PDF in the backend** to find all CPFs.
3. **Validates the format** of CPFs: `XXX.XXX.XXX-XX` (without advanced validations).
4. **Stores** these CPFs in the **Firebase Realtime Database**.
5. **List** the newly found CPFs **and** all previously stored ones.

## Getting Started
### Prerequisites
### Installation
### Usage

## Steps to create this project from 0

### Create a folder for your project

### BackEnd
---

#### Create the backend Node.js
```sh
mkdir backend && cd backend
npm init -y
```

#### Install the necessary dependencies
```sh
npm i express firebase-admin pdfjs-dist cors dotenv multer
```
* express: Framework to create REST API
* firebase-admin: Firebase SDK for Node.js
* pdfjs-dist: Manipulate PDFs
* cors: Allows the frontend to connect to the API
* dotenv: Load environment variables from .env file
* multer: middleware to handle file upload

#### Config the Firebase Admin SDK
1. Go to [Firebase Console](https://console.firebase.google.com/). and sign in with a Google account
2. Click "Create a project" and follow the instructions
3. After creation, go to "Realtime Database" and click "Create database"
4. Choose "Test Mode" (to allow temporary public access).
5. In the left menu, go to "Project Settings" > "Service Accounts"
6. Click on "Generate new private key" → This will download a .json file
7. 💡 This file will be used in the backend to connect Node.js to Firebase
8. Save the file inside the backend folder (example: firebase-key.json)

#### Create the server.js file inside the backend folder

#### Create the .env file inside the backend folder

#### Test the server
```sh
node server.js
```
To stop the server, press `CTRL + C` in the terminal.


### FrontEnd
---

#### Create the Vue 2 project
At the root of your project run
```sh
vue create frontend
```
- Select Manually select features 
- Select Babel and CSS Pre-processors
- Select Vue2
- Select Sass/SCSS
- Select In dedicated config files (optional)
- select if you want to save your preset

#### Install the necessary dependencies
```sh
npm i axios@0.21.1
```
* axios: To make HTTP requests.

#### Test the Vue 2 project
```sh
npm run serve
```
