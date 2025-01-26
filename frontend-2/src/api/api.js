import axios from "axios";

const API = axios.create({
  baseURL: "https://azure-library-project-back-faccasd8b3eueycs.eastus2-01.azurewebsites.net/api",
});

export default API;
