import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/blog/'; // Adjust if backend is on a different host (e.g., 'http://localhost:8000/api/v1/blog/')


export async function getBlogPosts() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogBySlug(slug) {
  try {
    const response = await axios.get(`${API_URL}${slug}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function likeBlogPost(slug) {
  try {
    const response = await axios.post(`${API_URL}${slug}/like/`);
    return response.data;
  } catch (error) {
    console.error('Error liking blog post:', error);
    return { status: 'error', likes_count: 0 };
  }
}