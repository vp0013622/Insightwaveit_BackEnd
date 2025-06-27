import axios from 'axios';
import FormData from 'form-data';

const FREEIMAGE_API_KEY = '6d207e02198a847aa98d0a2a901485a5';
const FREEIMAGE_API_URL = 'https://freeimage.host/api/1/upload';

export class ImageUploadService {
    /**
     * Upload image to freeimage.host
     * @param {Buffer} imageBuffer - The image buffer
     * @param {string} originalName - Original filename
     * @returns {Promise<Object>} Upload response with image URLs
     */
    static async uploadImage(imageBuffer, originalName) {
        try {
            const formData = new FormData();
            formData.append('key', FREEIMAGE_API_KEY);
            formData.append('action', 'upload');
            formData.append('format', 'json');
            
            // Append the image file
            formData.append('source', imageBuffer, {
                filename: originalName,
                contentType: this.getMimeType(originalName)
            });

            const response = await axios.post(FREEIMAGE_API_URL, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            if (response.data.status_code === 200 && response.data.success) {
                return {
                    success: true,
                    data: {
                        originalUrl: response.data.image.url,
                        thumbnailUrl: response.data.image.thumb.url,
                        mediumUrl: response.data.image.medium.url,
                        displayUrl: response.data.image.display_url,
                        imageId: response.data.image.id_encoded,
                        filename: response.data.image.filename,
                        size: response.data.image.size,
                        width: response.data.image.width,
                        height: response.data.image.height,
                        mimeType: response.data.image.mime
                    }
                };
            } else {
                throw new Error('Upload failed: ' + (response.data.status_txt || 'Unknown error'));
            }
        } catch (error) {
            console.error('Image upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get MIME type from filename
     * @param {string} filename 
     * @returns {string} MIME type
     */
    static getMimeType(filename) {
        const ext = filename.toLowerCase().split('.').pop();
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml'
        };
        return mimeTypes[ext] || 'image/jpeg';
    }

    /**
     * Convert buffer to base64 (alternative method)
     * @param {Buffer} buffer 
     * @returns {string} Base64 string
     */
    static bufferToBase64(buffer) {
        return buffer.toString('base64');
    }
} 