import React, {useState} from 'react';
import './app2.css';

function Form() {
  const [employees,setEmployees]=useState([]);
  const [searchQuery,setSearchQuery]=useState('');
  const [filteredEmployees,setFilteredEmployees]=useState([]);
  const [newEmployee, setNewEmployee]=useState({
    name: '', gender: '', email: '',
    phone: '', image: '', position: '',id: ''});

  const [isEditing,setIsEditing]=useState(false);
  const [currentEmployeeId,setCurrentEmployeeId]=useState('');
  const [errors,setErrors]=useState({});

  const validate=()=>{
    let tempErrors={};
    tempErrors.name=newEmployee.name?"":"This field is required.";
    tempErrors.gender=newEmployee.gender?"":"This field is required.";
    tempErrors.email=newEmployee.email?(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmployee.email)?"":"Are you a bot?"):"This field is required.";
    tempErrors.phone=newEmployee.phone?(/^\d{10}$/.test(newEmployee.phone)?"" :"How are we supposed to contact you?"):"This field is required.";
    tempErrors.id=newEmployee.id?"":"Government needs this.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x=>x==="");};

  const addEmployee=()=>{
    if(!validate()) return;
    if(employees.some(employee=>employee.id===newEmployee.id)){
      alert('Congrats you might be a clone.');
      return;}

    setEmployees([...employees,newEmployee]);
    resetForm();
    alert('Poverty avoided successfully!');};

  const resetForm=()=>{
    setNewEmployee({
      name: '', gender: '', email: '',
      phone: '', image: '', position: '',id: ''});
    setIsEditing(false);setCurrentEmployeeId('');setErrors({});};

  const deleteEmployee=(id)=>{
    setEmployees(employees.filter(employee=>employee.id!==id));};

  const editEmployee=(employee)=>{
    setNewEmployee(employee);setIsEditing(true);
    setCurrentEmployeeId(employee.id);};

  const updateEmployee=()=>{
    if(!validate()) return;
    setEmployees(employees.map(employee=>(employee.id===currentEmployeeId?newEmployee:employee)));
    resetForm();};

  const handleSubmit=()=>{
    if (isEditing){
      updateEmployee();}
      else {addEmployee();}};

  const handleSearch=()=>{
    setFilteredEmployees(employees.filter(employee=>employee.name.includes(searchQuery)||employee.id.includes(searchQuery)));};

  return (
    <div className="App">
      <h1>Employee Registration Form</h1>

      <div>
        <h2>Employee Query</h2>
        <input type="text" placeholder="Who are you looking for?" value={searchQuery}
          onChange={(e)=>setSearchQuery(e.target.value)}/>
        
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <h2>{isEditing?'Edit Employee':'Add Employee'}</h2>
        <input type="text" placeholder="Name/Initials?" value={newEmployee.name}
          onChange={(e)=>setNewEmployee({...newEmployee,name:e.target.value})}/>
       
        <div className="error">{errors.name}</div>

        <input type="email" placeholder="Email?" value={newEmployee.email}
          onChange={(e)=>setNewEmployee({...newEmployee,email:e.target.value})}/>

        <div className="error">{errors.email}</div>

        <input type="text" placeholder="PhoneNo?" value={newEmployee.phone}
          onChange={(e)=>setNewEmployee({...newEmployee,phone:e.target.value})}/>
        
        <div className="error">{errors.phone}</div>

        <input type="text" placeholder="Profile Pic?" value={newEmployee.image}
          onChange={(e)=>setNewEmployee({...newEmployee,image:e.target.value})}/>

        <input type="text" placeholder="Gender/Pronoun?" value={newEmployee.gender}
          onChange={(e)=>setNewEmployee({...newEmployee,gender:e.target.value})}/>
        
        <div className="error">{errors.gender}</div>

        <input type="text" placeholder="Position/Title?" value={newEmployee.position}
          onChange={(e)=>setNewEmployee({...newEmployee,position:e.target.value})}/>

        <input type="text" placeholder="ID?" value={newEmployee.id}
          onChange={(e)=>setNewEmployee({...newEmployee,id:e.target.value})}/>
        
        <div className="error">{errors.id}</div>

        <button onClick={handleSubmit}>{isEditing?'Update info?':'Submit Info?'}</button>
        {isEditing &&<button onClick={resetForm}>Cancel</button>}
      </div>

      <div class="table-container">
        <h2>Employee List</h2>
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
            {(searchQuery?filteredEmployees:employees)
            .map(employee=>(
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.gender}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                <td>{employee.id}</td>
                <td>
                  <button onClick={()=>editEmployee(employee)}>Edit</button>
                  <button onClick={()=>deleteEmployee(employee.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default Form;