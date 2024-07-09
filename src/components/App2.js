import React, { useState } from 'react';
import './app2.css';

function Form() {
  const [employees,setEmployees] =useState([]);
  const [searchQuery,setSearchQuery] =useState('');
  const [newEmployee,setNewEmployee] =useState({
    name: '',
    gender: '',
    email: '',
    phone: '',
    image: '',
    position: '',
    id: ''
  });
  const [isEditing, setIsEditing] =useState(false);
  const [currentEmployeeId,setCurrentEmployeeId] =useState('');

  const addEmployee = () => {
    if (employees.some(employee =>employee.id ===newEmployee.id)) {
      alert('Congrats you might be a clone.');
      return;
    }
    if (!newEmployee.name ||!newEmployee.email||!newEmployee.id) {
      alert('Fill in all required fields.');
      return;
    }
    setEmployees([...employees, newEmployee]);
    resetForm();
  };

  const resetForm = () =>{
    setNewEmployee({
      name: '',
      gender: '',
      email: '',
      phone: '',
      image: '',
      position: '',
      id: ''
    });
    setIsEditing(false);
    setCurrentEmployeeId('');
  };

  const deleteEmployee = (id) =>{
    setEmployees(employees.filter(employee =>employee.id !==id));
  };

  const editEmployee = (employee) =>{
    setNewEmployee(employee);
    setIsEditing(true);
    setCurrentEmployeeId(employee.id);
  };

  const updateEmployee = () =>{
    setEmployees(employees.map(employee => (employee.id === currentEmployeeId ? newEmployee : employee)));
    resetForm();
  };

  const handleSubmit = () =>{
    if (isEditing) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  return (
    <div className="App">
      <h1>Employee Registration Form</h1>
      
      <div>
        <h2>Employee Query</h2>
        <input
          type="text"
          placeholder="Search by ID?"
          value={searchQuery}
          onChange={(e) =>setSearchQuery(e.target.value)}
        />
      </div>
      
      <div>
        <h2>{isEditing? 'Edit Employee':'Add Employee'}</h2>
        <input
          type="text"
          placeholder="Name?"
          value={newEmployee.name}
          onChange={(e) =>setNewEmployee({...newEmployee,name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email?"
          value={newEmployee.email}
          onChange={(e) =>setNewEmployee({...newEmployee,email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone?"
          value={newEmployee.phone}
          onChange={(e) =>setNewEmployee({...newEmployee,phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL?"
          value={newEmployee.image}
          onChange={(e) =>setNewEmployee({...newEmployee,image: e.target.value })}
        />
        <input
          type="text"
          placeholder="Gender?"
          value={newEmployee.gender}
          onChange={(e) =>setNewEmployee({...newEmployee,gender: e.target.value })}
        />
        <input
          type="text"
          placeholder="Position?"
          value={newEmployee.position}
          onChange={(e) =>setNewEmployee({...newEmployee,position: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID?"
          value={newEmployee.id}
          onChange={(e) =>setNewEmployee({...newEmployee,id: e.target.value })}
        />
        <button onClick={handleSubmit}>{isEditing? 'Update Employee':'Add Employee'}</button>
        {isEditing && <button onClick={resetForm}>Cancel</button>}
      </div>
      
      <div>
        <h2>Employee List</h2>
        {employees
          .filter(employee =>employee.id.includes(searchQuery))
          .map(employee =>(
            <div key={employee.id}>
              <p>Name: {employee.name}</p>
              <p>Email: {employee.email}</p>
              <p>Gender: {employee.gender}</p>
              <p>Phone: {employee.phone}</p>
              <p>Position: {employee.position}</p>
              <p>ID: {employee.id}</p>
              <button onClick={() =>deleteEmployee(employee.id)}>Delete</button>
              <button onClick={() =>editEmployee(employee)}>Edit</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Form;
