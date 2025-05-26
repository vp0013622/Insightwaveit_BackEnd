// import fs from 'fs';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Storage config
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, path.join(__dirname, '../uploads'));
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + '-' + file.originalname);
// //   },
// // });

// // Ensure the uploads directory exists
// const uploadPath = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   // filename: (req, file, cb) => {
//   //   const filePath = path.join(uploadPath, file.originalname);

//   //   // Avoid re-uploading same file
//   //   if (fs.existsSync(filePath)) {
//   //     return cb(new Error('File already exists'), false);
//   //   }

//   //   cb(null, file.originalname);
//   // },

//   filename: (req, file, cb) => {
//     const fullPath = path.join(uploadPath, file.originalname);
//     if (fs.existsSync(fullPath)) {
//       return cb(new Error('File already exists'), false);
//     }
//     cb(null, file.originalname);
//   }
// });

// // Profile Picture Filter
// const ImageFilter = (req, file, cb) => {
//   const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedExtensions.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error('Only png, jpg, jpeg, svg, or webp files are allowed.'),
//       false
//     );
//   }
// };


// // Document Filter (PDF, DOC, XLS, TXT, etc.)
// const DocumentFilter = (req, file, cb) => {
//   const allowedTypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|plain/;
//   const isMimeTypeAllowed = allowedTypes.test(file.mimetype);

//   if (isMimeTypeAllowed) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error('Only PDF, Word, Excel, or text files are allowed'), 
//     false);
//   }
// };

// // Uploaders
// const UploadProfilePicture = multer({
//   storage,
//   fileFilter: ImageFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });

// // Uploaders
// const UploadPropertyImage = multer({
//   storage,
//   fileFilter: ImageFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });

// const UploadDocument = multer({
//   storage,
//   fileFilter: DocumentFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//   },
// });

// export { UploadProfilePicture, UploadPropertyImage,  UploadDocument};

import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profileImages = path.join(__dirname, '../profileImages');
const propertyImagesUploads= path.join(__dirname, '../propertyImagesUploads');
if (!fs.existsSync(profileImages)) {
  fs.mkdirSync(profileImages, { recursive: true });
}

if (!fs.existsSync(propertyImagesUploads)) {
  fs.mkdirSync(propertyImagesUploads, { recursive: true });
}

// Profile Picture Storage (check for duplicate)
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImages);
  },
  filename: (req, file, cb) => {
    const fullPath = path.join(profileImages, file.originalname);
    if (fs.existsSync(fullPath)) {
      return cb(new Error('File already exists'), false);
    }
    cb(null, file.originalname);
  },
});

// Property Image Storage (no duplicate check)
const propertyImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, propertyImagesUploads);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Image Filter
const ImageFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only png, jpg, jpeg, svg, or webp files are allowed.'), false);
  }
};

// Document Filter
const DocumentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|plain/;
  const isMimeTypeAllowed = allowedTypes.test(file.mimetype);
  if (isMimeTypeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, Word, Excel, or text files are allowed'), false);
  }
};

// Uploaders
const UploadProfilePicture = multer({
  storage: profileStorage,
  fileFilter: ImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const UploadPropertyImage = multer({
  storage: propertyImageStorage,
  fileFilter: ImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const UploadDocument = multer({
  storage: propertyImageStorage,
  fileFilter: DocumentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export { UploadProfilePicture, UploadPropertyImage, UploadDocument };
