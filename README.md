# Requests Builder

Request builder tool for creating [Sentinel Hub](https://www.sentinel-hub.com/develop/api/) Requests.

### Supported features (4 Feb 2021):

  - Create requests for the main APIs of Sentinel-Hub (Process, Batch, TPDI, OGC)
  - Send the request and see the results on the fly
  - Parse text requests to update the UI (useful for replicating, sharing or tweaking requests)
  - Select your own Area of Interest using an interactive map
  - Change between different CRS
  - Create data-fusion requests in a user-friendly way
  - Edit Evalscripts in a code-editor with a linter
  - See the request code in Javascript or Python (useful for integrating your own workflows)

### Incoming features

  - Support for the new statistical API
  - New CRS
  - Improved UI/UX

### Production deployment

This repository production deployment (based on latest tag) can be found on the following [link](https://apps.sentinel-hub.com/requests-builder/).

### How to run it locally.

1. Clone the repository using `git clone https://github.com/sentinel-hub/requests-builder`
2. Move to the project folder: `cd requests-builder` 
3. Install all the dependencies: `npm install`.

To get authentication running you will need to do the following:

- Go to your dashboard: https://apps.sentinel-hub.com/dashboard/#/ 
- Under `User Settings` create a new OAuth Client using `IMPLICIT` grant type and the following redirect url: http://localhost:3000/oauthCallback.html
- Inside the root project folder, fill up the `.env.example` with the following values:
    * REACT_APP_CLIENTID=<your_client_ID_from_previous_step>
    * REACT_APP_AUTH_BASEURL=https://services.sentinel-hub.com/
    * REACT_APP_ROOT_URL=http://localhost:3000/
4. Copy your .env.example to an .env file using: `cp .env.example .env`
5. Finally, start your local development server using: `npm start` 
