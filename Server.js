const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require('../EmployeeApp/aaaaaa-dd695-firebase-adminsdk-fypo9-b0cee237c6.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://aaaaaa-dd695.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; 
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb('Error: File type not allowed');
    },
});

app.post('/employees', upload.single('image'), async (req, res) => {
    console.log('Received body:', req.body); 
    console.log('Received file:', req.file);

    const employeeData = {
        name: req.body.name || '',
        email: req.body.email || '',
        gender: req.body.gender || '',
        phone: req.body.phone || '',
        position: req.body.position || '',
        id: req.body.id || '',
    };

    if (!employeeData.name || !employeeData.email || !employeeData.position || !employeeData.gender || !employeeData.phone) {
        return res.status(400).send({ error: 'Name, email, position, gender, and phone are required.' });
    }

    try {
        if (req.file) {
            const blob = bucket.file(`images/${Date.now()}-${req.file.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            blobStream.on('error', (err) => {
                console.error('Upload error:', err);
                return res.status(500).send({ error: 'Failed to upload image' });
            });
       
            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                employeeData.image = publicUrl;
                const newEmployee = await db.collection('employees').add(employeeData);
                res.status(201).send(`Employee added with ID: ${newEmployee.id}`);
            });

            blobStream.end(req.file.buffer);
        } else {
            employeeData.image = 'https://images.app.goo.gl/8L2ZQo5z3bfCmdfv9'; 
            const newEmployee = await db.collection('employees').add(employeeData);
            res.status(201).send(`Employee added with ID: ${newEmployee.id}`);
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(400).send({ error: 'Failed to add employee', message: error.message });
    }
});

app.get('/employees', async (req, res) => {
    try {
        console.log('Query parameters:', req.query);
        const employeesSnapshot = await db.collection('employees').get();
        const employees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send(error.message);
    }
});

app.put('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        await db.collection('employees').doc(employeeId).update(req.body);
        res.status(200).send('Employee updated successfully');
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(400).send(error.message);
    }});

app.delete('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        await db.collection('employees').doc(employeeId).delete();
        res.status(200).send('Employee deleted successfully');
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
