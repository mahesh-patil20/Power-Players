import React, { useState } from 'react';
import Recipe from '../../components/Recipe';
import "../../css_files/recipes.css";
import axios from 'axios';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  const getRecipes = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getrecipe`, { query: search });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }

  const updateSearch = e => {
    setSearch(e.target.value);
  }

  return (
    <div>
    <br></br>
      <h1 className='heading-top'>Search for Recipes</h1><br />
      <form onSubmit={getRecipes} className="search-form">
        <input className='search-bar' type='text' value={search} onChange={updateSearch} style={{
          borderRadius: '30px',
          border: '1px solid grey',
        
        }} />
        <button className='search-button' type="submit" style={{
          backgroundColor: '#168445',
          color: 'white',
          borderRadius: '30px',
          padding: '10px 20px',
          fontSize: '20px',
          cursor: 'pointer',
          margin: "0 10px"


        
        }}> Search</button>
      </form>
      <div className='innerform' style={{
        // border: "1px solid black",
        width: "85%",
        margin: "auto",
      }}>
        {recipes.map(recipe => (
          <Recipe
            key={recipe.recipe.label}
            title={recipe.recipe.label}
            calories={recipe.recipe.calories}
            image={recipe.recipe.image}
            ingredients={recipe.recipe.ingredients}
          />
        ))}
      </div>
    </div>
  )
}

export default Recipes;
