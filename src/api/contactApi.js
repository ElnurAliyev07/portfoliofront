import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/contact/'; // Adjust if your backend runs on a different host/port

export const sendContactMessage = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      errors: error.response?.data?.errors || { message: 'An error occurred while sending the message.' },
    };
  }
};