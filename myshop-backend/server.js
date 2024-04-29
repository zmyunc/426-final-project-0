const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();



/////2:10 add

const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images'), // Corrected path
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('itemImage'); // 'itemImage' is the field name in your form

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

app.use('/uploads', express.static('public/uploads'));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());

const USER_ID = 'specific-user-id'; // The ID for your single user
const SECRET_KEY = 'your-secret-key'; // A key known only to your server

let products = [
  { id: 1, name: "Apple", price: 1, imageUrl: "/images/apple.jpg", description: "Fresh apples from organic farms." },
  { id: 2, name: "Bread", price: 2, imageUrl: "/images/bread.jpg", description: "Whole wheat bread, freshly baked every morning." },
  { id: 3, name: "Carrot", price: 3, imageUrl: "/images/carrot.jpg", description: "Crunchy carrots perfect for a healthy diet." },
  { id: 4, name: "Banana", price: 4, imageUrl: "/images/banana.jpg", description: "Rich in potassium and natural sugars for energy." },
  { id: 5, name: "Tomato", price: 5, imageUrl: "/images/tomato.jpg", description: "Juicy tomatoes, ripe and ready for your salads." }
];


function getNextId() {
  const sortedIds = products.map(product => product.id).sort((a, b) => a - b);
  let nextId = 1;
  for (let id of sortedIds) {
    if (id !== nextId) {
      break;
    }
    nextId++;
  }
  return nextId;
}
//////////////////////add 21:06
app.post('/login', (req, res) => {
  // Authenticate the user
  if (req.body.secretKey === SECRET_KEY) {
      // Set a long-lived, secure, httpOnly cookie
      res.cookie('user_id', USER_ID, {
          httpOnly: true,
          secure: true, // Set to true if using https
          maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
      });
      return res.status(200).json({ message: 'Logged in' });
  } else {
      return res.status(401).json({ message: 'Unauthorized' });
  }
});
app.get('/check-session', (req, res) => {
  if (req.cookies.user_id === USER_ID) {
      return res.status(200).json({ message: 'Session active' });
  } else {
      return res.status(401).json({ message: 'Session inactive' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  return res.status(200).json({ message: 'Logged out' });
});
//////////////////add 21:06
// READ - Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// READ - Get single product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

// CREATE - Add a new product
app.post('/products', upload, (req, res) => {
  const { name, price } = req.body;
  const newId = getNextId();
  let imageUrl = '/images/no-image.jpg'; // Default image

  // If there's a file uploaded, use its URL
  if (req.file) {
    imageUrl = '/images/' + req.file.filename;
  }

  const newProduct = {
    id: newId,
    name,
    price: Number(price),
    imageUrl // Add imageUrl to your product object
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});


// UPDATE - Update a product by ID
app.put('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).send('Product not found');
  }
});

// DELETE - Delete a product by ID
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).send();
  } else {
    res.status(404).send('Product not found');
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let employees = [
  // This would start as an empty array, but for example:
  { id: 1, firstName: "John", lastName: "Doe" },
  { id: 2, firstName: "Jane", lastName: "Smith" },
  { id: 3, firstName: "Alice", lastName: "Johnson" },
  { id: 4, firstName: "James", lastName: "Brown" },
  { id: 5, firstName: "Linda", lastName: "Davis" },
  { id: 6, firstName: "Robert", lastName: "Miller" },
  { id: 7, firstName: "Patricia", lastName: "Wilson" },
  // ... other employees
];

// Function to find the next unique ID for a new employee
const getNextEmployeeId = () => {
  if (employees.length === 0) return 1;
  const maxId = Math.max(...employees.map(e => e.id));
  return maxId + 1;
};

// READ - Get all employees
app.get('/employees', (req, res) => {
  res.json(employees);
});

// READ - Get single employee by ID
app.get('/employees/:id', (req, res) => {
  const employee = employees.find(e => e.id === parseInt(req.params.id));
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send('Employee not found');
  }
});

function getNextIdemployees() {
  const sortedIds = employees.map(employees => employees.id).sort((a, b) => a - b);
  let nextId = 1;
  for (let id of sortedIds) {
    if (id !== nextId) {
      return nextId;
    }
    nextId++;
  }
  return nextId; // If no gaps, this will be the new highest ID
}

// CREATE - Add a new employee
app.post('/employees', (req, res) => {
  const { firstName, lastName } = req.body;
  const newId = getNextIdemployees();
  const newEmployee = { id: newId, firstName, lastName };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// UPDATE - Update an employee by ID
app.put('/employees/:id', (req, res) => {
  const { firstName, lastName } = req.body;
  const index = employees.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    employees[index] = { ...employees[index], firstName, lastName };
    res.json(employees[index]);
  } else {
    res.status(404).send('Employee not found');
  }
});

// DELETE - Delete an employee by ID
app.delete('/employees/:id', (req, res) => {
  const index = employees.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    employees = employees.filter(e => e.id !== parseInt(req.params.id));
    res.status(204).send();
  } else {
    res.status(404).send('Employee not found');
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
