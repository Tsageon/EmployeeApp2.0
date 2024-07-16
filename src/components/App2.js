import React, { useState } from 'react';
import './app2.css';

function Form() {
  const [employees,setEmployees] = useState([]);
  const [searchQuery,setSearchQuery] = useState('');
  const [filteredEmployees,setFilteredEmployees] = useState([]);
  const [newEmployee,setNewEmployee] = useState({
    name: '', gender: '', email: '',
    phone: '', image: '', position: '', id: ''
  });

  const [isEditing,setIsEditing] = useState(false);
  const [currentEmployeeId,setCurrentEmployeeId] = useState('');
  const [errors,setErrors] = useState({});

  const [showEmployeeQuery,setShowEmployeeQuery] = useState(false);
  const [showFormAndList,setShowFormAndList] = useState(false);

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = newEmployee.name ? "" : "This field is required.";
    tempErrors.gender = newEmployee.gender ? "" : "What do you identify as?";
    tempErrors.email = newEmployee.email ? (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmployee.email) ? "" : "Are you a bot?") : "This field is required.";
    tempErrors.phone = newEmployee.phone ? (/^\d{10}$/.test(newEmployee.phone) ? "" : "How are we supposed to contact you?") : "This field is required.";
    tempErrors.image = newEmployee.image ? "" : "Profile picture is required.";
    tempErrors.position = newEmployee.position ? "" : "Position is required.";
    tempErrors.id = newEmployee.id ? "" : "Government needs this.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const addEmployee = () => {
    if (!validate()) return;
    if (employees.some(employee => employee.id === newEmployee.id)) {
      alert('Congrats, you might be a clone.');
      return;
    }

    try {
      setEmployees([...employees, newEmployee]);
      resetForm();
      alert('Poverty avoided successfully!');
    } catch (error) {
      alert('Not Happening.Try again.');
    }
  };

  const resetForm = () => {
    setNewEmployee({
      name: '', gender: '', email: '',
      phone: '', image: '', position: '', id: ''
    });

    setIsEditing(false);
    setCurrentEmployeeId('');
    setErrors({});};

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  const editEmployee = (employee) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setCurrentEmployeeId(employee.id);
    setShowFormAndList(true);};

  const updateEmployee = () => {
    if (!validate()) return;

    try {
      setEmployees(employees.map(employee => (employee.id === currentEmployeeId ? newEmployee : employee)));
      resetForm();} 
      catch (error) {
      alert('Government things Happened.Try Again.');
    }};

  const handleSubmit = () => {
    if (isEditing) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  const handleSearch = () => {
    if (employees.length === 0) {
      alert('No employees found.');
      return;}

    setFilteredEmployees(employees.filter(employee => employee.name.includes(searchQuery) || employee.id.includes(searchQuery)));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(handleSearch, 300);
  };

  return (
    <div className="app">
      <h1>Employee Registration Form</h1>

      <div>
        <h2>
          {isEditing ? 'Edit Employee' : 'Add Employee'} & Employee List
          <button onClick={() => setShowFormAndList(!showFormAndList)}>
            {showFormAndList ? 'Hide' : 'Show'}
          </button>
        </h2>
        {showFormAndList && (
          <>
            <div>
              <input type="text" placeholder="Name/Initials?" value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee,name: e.target.value})}/>
              <div className="error">{errors.name}</div>

              <input type="email" placeholder="Email?" value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee,email: e.target.value})}/>
              <div className="error">{errors.email}</div>

              <input type="text" placeholder="PhoneNo?" value={newEmployee.phone}
                onChange={(e) => setNewEmployee({...newEmployee,phone: e.target.value})}/>
              <div className="error">{errors.phone}</div>

              <input type="text" placeholder="Profile Pic?" value={newEmployee.image}
                onChange={(e) => setNewEmployee({...newEmployee,image: e.target.value})}/>
              <div className="error">{errors.image}</div>

              <input type="text" placeholder="Gender/Pronoun?" value={newEmployee.gender}
                onChange={(e) => setNewEmployee({...newEmployee,gender: e.target.value})}/>
              <div className="error">{errors.gender}</div>

              <input type="text" placeholder="Position/Title?" value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee,position: e.target.value})}/>
              <div className="error">{errors.position}</div>

              <input type="text" placeholder="ID?" value={newEmployee.id}
                onChange={(e) => setNewEmployee({...newEmployee, id: e.target.value})}/>
              <div className="error">{errors.id}</div>

              <button onClick={handleSubmit}>{isEditing ? 'Update info?' : 'Submit Info?'}</button>
              {isEditing && <button onClick={resetForm}>Cancel</button>}
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
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
                  {(searchQuery ? filteredEmployees : employees)
                    .map(employee => (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.gender}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.position}</td>
                        <td>{employee.id}</td>
                        <td>
                          <button onClick={() => editEmployee(employee)}>Edit</button>
                          <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div>
        <h2>
          Employee Query
          <button onClick={() => setShowEmployeeQuery(!showEmployeeQuery)}>
            {showEmployeeQuery ? 'Hide' : 'Show'}
          </button>
        </h2>
        {showEmployeeQuery && (
          <div>
            <input type="text" placeholder="Who are you looking for?" value={searchQuery}
              onChange={handleSearchChange} />
            <button onClick={handleSearch}>Search</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;
