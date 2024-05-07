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

# Running the MedSync Webapp

## Prerequisites
Before you start, ensure you have MongoDB properly installed and set up. Follow the [documentation](https://www.mongodb.com/docs/manual/installation/) for installation instructions.

## Setup

### Cloning the Repository
First, open a terminal in your chosen environment and clone the repository:
```bash
git clone https://github.com/faizanraza09/MedSync.git
```

## Seting up the backend

1. Navigate to the backend directory:
```bash
cd MedSync/backend
```
2. Install the necessary npm packages:
```bash
npm install
```
3. Start the backend server:
```bash
node server.js

```
## Setting up the frontend

1. Open another terminal and navigate to the frontend directory:

```bash
cd MedSync/frontend  # Assumes you're starting from the same initial environment
```

2. Install the necessary npm packages:
```bash
npm install
```

3. Start the frontend application:
```bash
npm start
```

## Running the application
With both the backend and frontend set up, your web application should now be running. You can access it through the browser at the address provided by the npm start command in the frontend setup.








