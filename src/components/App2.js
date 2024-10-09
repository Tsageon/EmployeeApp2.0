import React, { useState, useRef, useEffect } from 'react';
import { storage,db  } from '../Config/firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL  } from 'firebase/storage';
import axios from 'axios';
import './app2.css';

function Form() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({name: '', gender: '', email: '', phone: '', image: '', position: '', id: ''});
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('form');
  const searchTimeoutRef = useRef(null);

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = newEmployee.name ? "" : "This field is required.";
    tempErrors.gender = newEmployee.gender ? "" : "What's Your Gender?";
    tempErrors.email = newEmployee.email ? (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmployee.email) ? "" : "Are you a Robot?") : "This field is required.";
    tempErrors.phone = newEmployee.phone ? (/^\d{10}$/.test(newEmployee.phone) ? "" : "How will we contact you?") : "This field is required.";
    tempErrors.image = newEmployee.image ? "" : "Profile Picture is required.";
    tempErrors.position = newEmployee.position ? "" : "Position is required.";
    tempErrors.id = newEmployee.id ? (/^\d{13}$/.test(newEmployee.id) ? "" : "This needs to be 13 digits.") : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const resetForm = () => {
    setNewEmployee({
      name: '', gender: '', email: '', phone: '', image: '', position: '', id: ''
    });
    setIsEditing(false);
    setCurrentEmployeeId('');
    setErrors({});
  };

  const deleteEmployee = async (id) => {
    try {
      const employeeDoc = doc(db, 'employees', id);
      await deleteDoc(employeeDoc);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Error deleting employee', error);
      alert('Error deleting employee.');
    }
  };

  const editEmployee = (employee) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setCurrentEmployeeId(employee.id);
    setActiveTab('form');
  };

  const uploadImageToFirebase = async (imageFile) => {
    const imageRef = ref(storage, `images/${imageFile.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeeCollection = collection(db, 'employees');
      const employeeSnapshot = await getDocs(employeeCollection);
      const employeeList = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeList);
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
  if (!validate()) return;

  let imageUrl = '';
  if (newEmployee.image) {
    imageUrl = await uploadImageToFirebase(newEmployee.image);
  }

  const employeeData = {
    name: newEmployee.name,
    email: newEmployee.email,
    image: imageUrl,
    phone: newEmployee.phone,
    gender: newEmployee.gender,
    position: newEmployee.position,
    id: newEmployee.id,
  };

  try {
    const employeesCollectionRef = collection(db, 'employees');

    if (isEditing) {

      const employeeDocRef = doc(db, 'employees', currentEmployeeId);
      await updateDoc(employeeDocRef, employeeData);

      await axios.put(`http://localhost:5000/employees/${currentEmployeeId}`, employeeData);
      alert('Employee updated in both Firestore and backend!');
    } else {

      await addDoc(employeesCollectionRef, employeeData);

      await axios.post('http://localhost:5000/employees', employeeData);
      alert('Employee added to both Firestore and backend!');
    }

    resetForm();
  } catch (error) {
    console.error('Error submitting employee data', error);
    alert('Error submitting employee data.');
  }
};
  
  const handleSearch = () => {
    setFilteredEmployees(employees.filter(employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.includes(searchQuery)
    ));
    setActiveTab('list'); 
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);
  };

  const renderForm = () => (
    <>
      <input type="text" placeholder="Name" value={newEmployee.name}
        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
      <div className="error">{errors.name}</div>

      <input type="email" placeholder="Email" value={newEmployee.email}
        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
      <div className="error">{errors.email}</div>

      <input type="text" placeholder="PhoneNumber" value={newEmployee.phone}
        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
      <div className="error">{errors.phone}</div>

      <input type="file" accept="image/*"
      onChange={(e) => setNewEmployee({ ...newEmployee, image: e.target.files[0] })} />
      <div className="error">{errors.image}</div>

      <select className="styled-select"
        value={newEmployee.gender}
        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <div className="error">{errors.gender}</div>

      <input type="text" placeholder="Position" value={newEmployee.position}
        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
      <div className="error">{errors.position}</div>

      <input type="text" placeholder="ID" value={newEmployee.id}
        onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })} />
      <div className="error">{errors.id}</div>

      <button className='edit-btns' onClick={handleSubmit}>
        {isEditing ? 'Update' : 'Submit'}
      </button>
      {isEditing && <button onClick={resetForm}>Cancel</button>}
    </>
  );

  const renderEmployeeList = () => (
    
    <div className="table-container">
      <table>
        <thead>
          <tr><th>Profile Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Position</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(searchQuery ? filteredEmployees : employees).length > 0 ? (
            (searchQuery ? filteredEmployees : employees)
              .map(employee => (
                <tr key={employee.id}>
                  <td>
                    {employee.image ? (
                      <img src={employee.image} alt={employee.name} className="employee-image"/>
                    ) : (
                      'No image'
                    )}
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.position}</td>
                  <td>{employee.id}</td>
                  <td>
                    <button className='edit' onClick={() => editEmployee(employee)}>Edit</button>
                    <button className='delete' onClick={() => deleteEmployee(employee.id)}>Delete</button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="8">No employees yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  
  const renderSearch = () => (
    <>
      <input type="text" placeholder="Search for employee" value={searchQuery} onChange={handleSearchChange} />
      <button className='search' onClick={handleSearch}>Search</button>
    </>
  );

  return (
    <div className="app">
      <h1>Employee Registration Form</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('form')} className={activeTab === 'form' ? 'active-tab' : ''}>Employee Form</button>
        <button onClick={() => setActiveTab('list')} className={activeTab === 'list' ? 'active-tab' : ''}>Employee List</button>
        <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active-tab' : ''}>Search</button>
      </div>
      {activeTab === 'form' && (
        <div>
          <h2 className="Two-headings">{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
          {renderForm()}
        </div>
      )}
      {activeTab === 'list' && (
        <div>
          <h2 className="Two-headings">Employee List</h2>
          {renderEmployeeList()}
        </div>
      )}
      {activeTab === 'search' && (
        <div>
          <h2 className="Query-heading">Employee Query</h2>
          {renderSearch()}
          {}
          {searchQuery && renderEmployeeList()}
        </div>
      )}
    </div>
  );
}

export default Form;