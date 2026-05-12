import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import JwtTool from './pages/JwtTool';
import EncryptionDecryptionTool from './pages/EncryptionDecryptionTool';
import CodeDiffTool from './pages/CodeDiffTool';

function App() {
  return (
    <Router basename='/dev-util-site'>
      <div className='bg-gray-100 dark:bg-gray-900 dark:text-white'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/jwt-decode-minify' element={<JwtTool />} />
          <Route path="/payload-encr-decr" element={<EncryptionDecryptionTool />} />
          <Route path="/code-diff" element={<CodeDiffTool />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
