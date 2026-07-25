import { useState } from 'react';
import { Box, Button, Avatar, Stack, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function ProfileUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('fingrow_token');
      const { data } = await axios.post('/api/profile/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setImageUrl(data.profileImage);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5 }}>
      <Avatar src={imageUrl || undefined} sx={{ width: 72, height: 72 }} />
      <Button variant="outlined" component="label" disabled={uploading}>
        {uploading ? <CircularProgress size={20} /> : 'Upload profile picture'}
        <input hidden accept="image/*" type="file" onChange={handleUpload} />
      </Button>
      <Typography variant="caption" color="text.secondary">PNG, JPG, or WEBP up to 5MB.</Typography>
    </Box>
  );
}
