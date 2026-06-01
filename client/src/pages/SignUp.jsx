import  { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

const SignUp = () => {
  // to handle form data and submit
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep previous form data
      [e.target.id]: e.target.value, // Update the field based on input id. [] -- use dynamic key (input id) to update specific field
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent page loading on form submit
    try {
      setLoading(true) // Set loading state to true when form is submitted
      const res = await fetch('/api/auth/signup', 
        {
          method: 'POST',
          headers: {  // Tell server we are sending JSON data
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),  // Convert formData object into JSON string.. Object → string
        }
      );
      const data = await res.json(); // Convert server response (JSON) into JavaScript object.. JSON → object
      console.log(data)
      if(data.success === false){
        setError(data.message) // Set error message from server response  
        setLoading(false) // Set loading state to false if there is an error
        return;
      }
      setLoading(false) // Set loading state to false if there is no error  
      setError(null) // Clear any previous error messages
      navigate('/sign-in') // Navigate to sign-in page after successful sign-up
      
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }

  }
  console.log(formData)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit= {handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} /> 
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'onChange={handleChange} /> 
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/> 
        <button disabled = {loading} className='bg-slate-700 text-white p-3 rounded-lg  cursor-pointer uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to = {"/sign-in"}> <span className='text-blue-700'>Sign In</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp
