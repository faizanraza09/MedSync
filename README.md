# MedSync

MedSync is a web application primarily aimed towards private general
practitioners who seek to enhance doctor-patient interactions. Through a doctor-
patient management system, we provide user-friendly interfaces for both the
doctors and the patients. MedSync enables patients to smoothly schedule
appointments by providing real-time availability updates. Patients could also
receive medical prescriptions, access diagnostic reports, and even opt for remote
consultations via the video chat option provided through the system; throughout
their consultations, patients will stay informed with notifications. Furthermore,
doctors who use our platform could utilize the power of ApiMedic to gain intelligent
diagnostic support to aid them in making well-informed decisions quickly. The
project encompasses both front-end and back-end solutions in collaboration with
a database for storing patient and doctor information. The medical management
system is set out to ensure that users stay ahead in the rapidly evolving digital
healthcare landscape.

## Team Members

| Name              | LinkedIn                                | GitHub                                 |
|-------------------|-----------------------------------------|----------------------------------------|
| Faizan Raza       | [LinkedIn](https://www.linkedin.com/in/faizanraza09/) | [GitHub](https://github.com/faizanraza09)       |
| Khadija Khalid    | [LinkedIn](https://www.linkedin.com/in/khadija-khalid-117873264/) | [GitHub](https://github.com/khadija24268)       |
| Sohaila Mohammed  | [LinkedIn](https://www.linkedin.com/in/sohaila-m-9364492b4/) | [GitHub](https://github.com/Sohila-Mohammed)       |
| Ajla Šačić        | [LinkedIn](https://www.linkedin.com/in/ajla-sacic-706749249/) | [GitHub](https://github.com/aylasacic)       |


# Running the MedSync Webapp

## Prerequisites
Before you start, ensure you have MongoDB properly installed and set up. Follow the [documentation](https://www.mongodb.com/docs/manual/installation/) for installation instructions.

## Setup

### Cloning the Repository
First, open a terminal in your chosen environment and clone the repository:

```bash
git clone https://github.com/faizanraza09/MedSync.git
```

## .env file
Create .env file in both MedSync/backend and MedSync/frontend

You can do this by running
```bash
cd MedSync/backend

touch .env
```

then

```bash
cd MedSync/frontend

touch .env
```

## Seting up the backend

1. Navigate to the backend directory:
```bash
cd MedSync/backend
```

2. In backend .env add:
```bash
MONGO_URI=mongodb://localhost:27017/medsync
USERNAME= # Your APIMedic Username
PASSWORD= # Your APIMedic Password
APIMEDIC_AUTH_URL=https://sandbox-authservice.priaid.ch/login
APIMEDIC_HEALTH_URL=https://sandbox-healthservice.priaid.ch
LANGUAGE=en-gb
```
To get the APIMedic Username and Password, register at https://apimedic.com and get credentials (either sandbox or live)
Note: The connection is not secure as of 07/05/2024

3. Install the necessary npm packages:
```bash
npm install
```
4. Start the backend server:
```bash
node server.js

```
## Setting up the frontend

1. Open another terminal and navigate to the frontend directory:

```bash
cd MedSync/frontend  # Assumes you're starting from the same initial environment
```

2. In frontend .env add:
```bash
REACT_APP_API_URL=http://localhost:3001
SERVER_SECRET= "Your ZegoCloud Secret Key"
```
For ZegoCloud setup go to [ZegoCloud Documentation](https://www.zegocloud.com/docs/) in order to obtain the ZegoCloud secret. 

Here are the steps: <ul>
<li> Visit ZegoCloud's <a href = "https://www.zegocloud.com">website</a> and register for an account. </li>
<li> Go to your dashboard and click on "Create Project."</li>
<li> Select "Voice & Video Call" as the project type.</li>
<li> Name your project and choose "Start with UIKits" for initialization.</li>
<li> Return to your dashboard and click on your newly created project to view its details.</li>
<li> Inside the project details, find and note the server secret for further configurations. </li>
</ul>

2. Install the necessary npm packages:
```bash
npm install
```

4. Start the frontend application:
```bash
npm start
```

If ZegoCloud SDK is not installed, run

```bash
npm install @zegocloud/zego-uikit-prebuilt --save
```

## Running the application
With both the backend and frontend set up, your web application should now be running. You can access it through the browser at the address provided by the npm start command in the frontend setup.







