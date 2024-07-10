const validate =() =>{
    let tempErrors= {};
    tempErrors.name= newEmployee.name? "" : "This field is required.";
    tempErrors.email= newEmployee.email? (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmployee.email) ? "" : "Email is not valid.") :"This field is required.";
    tempErrors.phone= newEmployee.phone? (/^\d{10}$/.test(newEmployee.phone)? "" : "How are we supposed to contact you?") :"This field is required.";
    tempErrors.id= newEmployee.id? "" : "Government needs this.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x =>x ==="");
  };