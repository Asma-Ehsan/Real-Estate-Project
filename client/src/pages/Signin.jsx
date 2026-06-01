import  { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInStart } from '../redux/user/userSlice'
import { signInSuccess } from '../redux/user/userSlice'
import { signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
  // to handle form data and submit
 const [formData, setFormData] = useState({})
 const {loading, error} = useSelector((state) => state.user); //Get loading and error values from the user slice of the Redux store

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep previous form data
      [e.target.id]: e.target.value, // Update the field based on input id. [] -- use dynamic key (input id) to update specific field
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent page loading on form submit
    try {
      dispatch(signInStart()) // Dispatch signInStart action to set loading state to true when login request starts
      const res = await fetch('/api/auth/signin', 
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
        dispatch(signInFailure(data.message)) // Dispatch signInFailure action with error message from server if login fails
        console.log(data.message)
        return;
      }
      dispatch(signInSuccess(data))
      console.log(data)
      navigate('/') // Navigate to sign-in page after successful sign-up
      
    } catch (error) {
      dispatch(signInFailure(error.message)) // Dispatch signInFailure action with error message if there is an error during the login process
    }

  }
  console.log(formData)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit= {handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'onChange={handleChange} /> 
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/> 
        {/* disabled = {loading}: Disable the button when loading is true */}
        <button disabled = {loading} className='bg-slate-700 text-white p-3 rounded-lg  cursor-pointer uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to = {"/sign-up"}> <span className='text-blue-700'>Sign Up</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn
