import axios from "axios";
const baseUrl = "https://backend.cappsule.co.in/api/v1/new_search?q=";
const pharmacyIds ='1,2,3'

export const fetchData = async (searchQuery) => {
  const response = await axios.get(
    `${baseUrl}${searchQuery}&pharmacyIds=${pharmacyIds}`
  );
  return response.data;
};

