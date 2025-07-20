import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/project/';

export async function getProjects() {
  try {
    const response = await axios.get(API_URL);
    console.log('Fetched projects:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id) {
  try {
    const response = await axios.get(`${API_URL}${id}/`);
    console.log('Fetched project:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function starProject(id) {
  try {
    const response = await axios.post(`${API_URL}${id}/star/`);
    console.log('Star project response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error starring project:', error);
    return { status: 'error', stars_count: 0 };
  }
}