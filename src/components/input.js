<div>
<input
type="text"
placeholder="Name?"
value={newEmployee.name}
onChange={(e) =>setNewEmployee({...newEmployee,name:e.target.value })}
/>
<div className="error">{errors.name}</div>

<input
type="email"
placeholder="Email?"
value={newEmployee.email}
onChange={(e) => setNewEmployee({...newEmployee,email: e.target.value })}
/>
<div className="error">{errors.email}</div>

<input
type="text"
placeholder="Phone?"
value={newEmployee.phone}
onChange={(e) =>setNewEmployee({...newEmployee,phone: e.target.value })}
/>
<div className="error">{errors.phone}</div>

<input
type="text"
placeholder="Image URL?"
value={newEmployee.image}
onChange={(e) =>setNewEmployee({...newEmployee,image:e.target.value })}
/>

<input
type="text"
placeholder="Gender?"
value={newEmployee.gender}
onChange={(e) =>setNewEmployee({...newEmployee,gender:e.target.value })}
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
onChange={(e) =>setNewEmployee({...newEmployee, id:e.target.value })}
/>
<div className="error">{errors.id}</div>

<button onClick={handleSubmit}>{isEditing? 'Update Employee':'Add Employee'}</button>
{isEditing && <button onClick={resetForm}>Cancel</button>}
</div>
