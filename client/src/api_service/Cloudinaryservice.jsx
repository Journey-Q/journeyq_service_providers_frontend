const CloudinaryStorageService = {
    CLOUDINARY_CLOUD_NAME: 'dgihkeczq', // Replace with your Cloudinary cloud name
    CLOUDINARY_UPLOAD_PRESET: 'upload_1', // Replace with your upload preset
    
    validateFile(file) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
      }
      
      return true;
    },

    generateFileName(originalName, serviceProviderId) {
      const timestamp = Date.now();
      const extension = originalName.split('.').pop();
      return `hotel_${serviceProviderId}_${timestamp}.${extension}`;
    },
    
    async uploadImage(file, fileName) {
      try {
        // Validate file first
        this.validateFile(file);
        
        // Create form data for Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
        
        // Optional: Add custom public_id (filename without extension)
        const publicId = fileName.split('.')[0];
        formData.append('public_id', `service-profiles/${publicId}`);
        
        // Optional: Add folder organization
        formData.append('folder', 'service-profiles');
        
        console.log('Uploading file to Cloudinary:', fileName, 'Size:', file.size, 'Type:', file.type);
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );
        
        const responseData = await response.json();
        console.log('Cloudinary response status:', response.status);
        console.log('Cloudinary response:', responseData);
        
        if (!response.ok) {
          const errorMessage = responseData.error?.message || responseData.message || 'Failed to upload image';
          throw new Error(`Upload failed: ${errorMessage}`);
        }
        
        // Return the secure URL from Cloudinary
        const publicURL = responseData.secure_url;
        console.log('Cloudinary public URL:', publicURL);
        
        return publicURL;
        
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    }
  };

  export default CloudinaryStorageService;
