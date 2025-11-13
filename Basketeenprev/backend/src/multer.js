// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         return cb(null, path.join(__dirname, '..', 'uploads'));
//     },
//     filename: function (req, file, cb) {
//         let nome_sem_espaco = file.originalname.trim()
//         let nome_array = nome_sem_espaco.split(' ')
//         let nome_com_underline = nome_array.join('_')
//         return cb(null, `${Date.now()}_${nome_com_underline}`);
//     }
 
// })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.trim().split(' ').join('_');
      cb(null, `${Date.now()}_${safeName}`);
    },
  });
  const upload = multer({ storage });