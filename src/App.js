import React, { useState } from 'react';
import Form from "./components/App2"

function App() {

  const [toggle, setToggle] = useState(true);

  return (
    <div className="App">

    <button onClick={() => setToggle(!toggle)}><h4 className='Refresh'>Reset</h4></button>
     {toggle && <Form/>}
    </div>
  );
}

export default App;