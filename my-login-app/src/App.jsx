import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate  } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import './App.css'
import categories from './components/categories'
// import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isFound, setFound] = useState(false)
  const [categories, setCategories] = useState([])

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
        var details = {
            'client_id': 'web-dashboard',
            'client_secret': 'SuperSecretPassword', //Dont usually expose secret but ran out of time
            'scope': 'openid profile role email offline_access adminApi mobileApi',
            'grant_type': 'password',
            'username': email,
            'password': password
        };

        
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        const res = await fetch('https://edeaf-api-staging.azurewebsites.net/connect/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formBody
        });
        const token = await res.json();
        const accessToken = token.access_token;
       
        //After getting token get users
        const resp = await fetch('https://edeaf-api-staging.azurewebsites.net/v1/admin/Users', {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })

        // Fetch Categories
      const getCategories = async () => {
      const res = await fetch('https://edeaf-api-staging.azurewebsites.net/v1/admin/categories')
      const data = await res.json()
      const result = data.data
      return result
    }

    // Fetch category (1)
    const getCategory = async (id) => {
    const res = await fetch(`https://edeaf-api-staging.azurewebsites.net/v1/admin/categories/${id}`)
    const data = await res.json()

    return data

    setCategories(
      categories.map((category) =>
      category.id === id ? { ...category, name: result.name } : category
      )
    )
  }

    } catch (err) {
      console.log(err);
    }
  };

  return (
        <div className="App">
         <form onSubmit={handleSubmit}>
         <input
             type="email"
             value={email}
             placeholder="Email"
             onChange={(e) => setEmail(e.target.value)}
           />
           <input
             type="password"
             value={password}
             placeholder="Password"
             onChange={(e) => setPassword(e.target.value)}
           />
           <button type="submit" >Login</button>
         </form>
          {/* <categories categories={categories}/> */}
       </div>
  )
}

export default App
