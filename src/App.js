import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const[loading ,setloading ] = useState(false)
  const [photos , setphotos] = useState([])
  const [page,setpage] = useState(0)
  const [query, setquery] =  useState('')
  const fetchImages = async() => {
    setloading(true)
    let url;
    const urlpage = `&page=${page}`
    const urlquery = `&query=${query}`
    if (query) {
      url = `${searchUrl}${clientID}${urlpage}${urlquery}` 
      console.log(query)     
    } else {
      url = `${mainUrl}${clientID}${urlpage}`
    }
      
    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
      setphotos((oldphotos)=>{
        if (query && page === 1){
          return data.results
        }
       else if (query) {
          return [...oldphotos, ...data.results]
        } else {
          return [...oldphotos,...data]
          
        }
      })
      setloading(false)
    } catch (error) {
      setloading(false)
     console.log(error) 
    }
  }
  useEffect(()=>{
    fetchImages()
  } ,[page])

  useEffect(()=>{
  const event = window.addEventListener('scroll',()=>{
   if  ( !loading && window.innerHeight + window.scrollY >= document.body.scrollHeight -2) {
     setpage((oldpage) =>{
       return oldpage + 1
     })
   }
  })
  return () => window.removeEventListener('scroll',event)
  },[])

  const handlesubmit = (e) => {
    e.preventDefault()
    setpage(1)

  }
  return <main>
    <section className='search'>
      <form className='search-form'>
      <input type="text" placeholder='search' className='form-input' value={query} onChange={(e) => setquery(e.target.value)}/>
      <button type='submit' className='submit-btn' onClick={handlesubmit}><FaSearch/></button>
      </form>
    </section>
    <section className='photos'>
      <div className="photos-center">
        {photos.map((image,index)=>{
          return <Photo key={image.id} {...image} />
        })}
      </div>
      {loading &&  <h2 className='loading' >loading ...</h2>}
    </section>
  </main>
}

export default App
