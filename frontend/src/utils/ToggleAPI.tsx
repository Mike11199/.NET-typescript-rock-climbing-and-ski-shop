//****************************************************************************************************** */
//* Use this global to toggle what API the app uses.
//* To import apiUrl in any .tsx file, use:
//*     "import apiUrl from 'apiUrl"
//*
//* This works as this file - apiUrl.tsx - is in the base folder defined in tsconfig.json - "baseUrl": "./src".
//*
//* "/api" = express.js - useAPIV2 = false
//* "/apiv2" = .NET - useAPIV2 = true
//*
//****************************************************************************************************** */
const useAPIV2 = true  //toggle API
// const useAPIV2 = true  //toggle API

const apiURL = useAPIV2 ? '/apiv2' : '/api';

export default apiURL;