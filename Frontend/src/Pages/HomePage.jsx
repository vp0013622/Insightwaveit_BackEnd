import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const HomePage = () => {
    //remove this use state and useeffect because it is for your your demo use only
    const [greetingTitle, setGreetingTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        axios.get('http://localhost:8080/api/') //use hosted api link here it will not work in your pc
        .then((res)=>{
            const responseData = res.data.message;
            if(responseData!=null){
                setGreetingTitle(responseData)
                setIsLoading(false)
            }
            else{
                setGreetingTitle('')
                alert('response is null') //use the snackbar or customised alert message on top
                setIsLoading(false)
            }
        })
        .catch((error)=>{
            console.log("error while fetching api: \n", error) //use the snackbar or customised alert message on top
            alert(error);
            setIsLoading(false)
        })
      
    }, [])
    
  return (
    isLoading ? (<p>Loading...</p>) : 
    (<div className='bg-red-800 text-white'>{greetingTitle}</div>)
  )
}

export default HomePage