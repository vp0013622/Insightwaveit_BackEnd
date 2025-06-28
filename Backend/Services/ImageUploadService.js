import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: 'doaqk3uzf', 
    api_key: '432491213828981', 
    api_secret: 'y1b0BgyCVUbjKJe1pdGtoyhihp8'
});

export class ImageUploadService {
    /**
     * Upload image to Cloudinary
     * @param {Buffer} imageBuffer - The image buffer
     * @param {string} originalName - Original filename
     * @param {string} folder - Folder to upload to (optional)
     * @returns {Promise<Object>} Upload response with image URLs
     */
    static async uploadImage(imageBuffer, originalName, folder = 'insightwaveit') {
        try {
            // Convert buffer to base64
            const base64Image = `data:${this.getMimeType(originalName)};base64,${imageBuffer.toString('base64')}`;
            
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(base64Image, {
                folder: folder,
                public_id: this.generatePublicId(originalName),
                resource_type: 'image',
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            });

            console.log('Cloudinary upload result:', {
                public_id: uploadResult.public_id,
                secure_url: uploadResult.secure_url,
                folder: folder
            });

            // Generate different size URLs
            const originalUrl = cloudinary.url(uploadResult.public_id, {
                secure: true,
                resource_type: 'image'
            });

            const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
                secure: true,
                resource_type: 'image',
                width: 150,
                height: 150,
                crop: 'fill'
            });

            const mediumUrl = cloudinary.url(uploadResult.public_id, {
                secure: true,
                resource_type: 'image',
                width: 300,
                height: 300,
                crop: 'fill'
            });

            const displayUrl = cloudinary.url(uploadResult.public_id, {
                secure: true,
                resource_type: 'image',
                width: 800,
                height: 600,
                crop: 'fill'
            });

            console.log('Generated URLs:', {
                originalUrl,
                thumbnailUrl,
                mediumUrl,
                displayUrl
            });

            return {
                success: true,
                data: {
                    originalUrl: originalUrl,
                    thumbnailUrl: thumbnailUrl,
                    mediumUrl: mediumUrl,
                    displayUrl: displayUrl,
                    imageId: uploadResult.public_id,
                    filename: uploadResult.original_filename,
                    size: uploadResult.bytes,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    mimeType: uploadResult.format,
                    cloudinaryId: uploadResult.public_id,
                    secureUrl: uploadResult.secure_url
                }
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Upload profile picture to Cloudinary
     * @param {Buffer} imageBuffer - The image buffer
     * @param {string} originalName - Original filename
     * @returns {Promise<Object>} Upload response with image URLs
     */
    static async uploadProfilePicture(imageBuffer, originalName) {
        return this.uploadImage(imageBuffer, originalName, 'insightwaveit/profile-pictures');
    }

    /**
     * Upload property image to Cloudinary
     * @param {Buffer} imageBuffer - The image buffer
     * @param {string} originalName - Original filename
     * @returns {Promise<Object>} Upload response with image URLs
     */
    static async uploadPropertyImage(imageBuffer, originalName) {
        return this.uploadImage(imageBuffer, originalName, 'insightwaveit/property-images');
    }

    /**
     * Delete image from Cloudinary
     * @param {string} publicId - Cloudinary public ID
     * @returns {Promise<Object>} Delete response
     */
    static async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: 'image'
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate a unique public ID for Cloudinary
     * @param {string} filename 
     * @returns {string} Public ID
     */
    static generatePublicId(filename) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        // Remove file extension for Cloudinary public_id
        const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
        return `${timestamp}_${randomString}`;
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