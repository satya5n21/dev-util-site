import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import Editor from '../components/Editor';
import BackButton from '../components/BackButton';

export default function JwtTool() {
  const [jwtInput, setJwtInput] = useState('');
  const [decodedOutput, setDecodedOutput] = useState('');

  const handleDecode = () => {
    try {
      const decoded = jwtDecode(jwtInput);
      const formatted = JSON.stringify(decoded, null, 2);
      setDecodedOutput(formatted);
    } catch (error) {
      console.log("Error occured during decode: ", error);
      alert('Given token is invalid');
    }
  };

  const handleMinify = () => {
    try {
      const minified = JSON.stringify(JSON.parse(decodedOutput));
      setDecodedOutput(minified);
    } catch (error) {
      alert('Minify failed. Make sure the text is valid JSON.');
    }
  };

  return (
    <div className='flex flex-col h-screen p-4'>
      <BackButton />
      <header className="sticky top-0 z-10 py-4 px-6 shadow-sm">
        <h1 className="text-2xl font-bold underline underline-offset-4 text-center">
          JWT Decode / Minify Tool
        </h1>
      </header>

      <div className='flex flex-1 overflow-hidden'>
        <Editor title="JWT Token"
          wrap={true}
          value={jwtInput} onChange={setJwtInput} />
        <div className='flex justify-around gap-2 p-2'>
        </div>
        <Editor title="Decoded Output"
          wrap={true}
          value={decodedOutput} onChange={setDecodedOutput} />
      </div>

      <div className='mt-4 mx-2 flex justify-around gap-8'>
        <button className='w-full p-2 bg-green-600 hover:bg-green-700 transition-colors dark:text-white cursor-pointer rounded-lg'
          onClick={handleDecode}>Decode</button>
        <button className='w-full p-2 bg-blue-600 hover:bg-blue-700 transition-colors dark:text-white cursor-pointer rounded-lg'
          onClick={handleMinify}>Minify</button>
      </div>

    </div>
  )
}
