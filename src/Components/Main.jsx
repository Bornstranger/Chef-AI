import { useState, useRef } from "react"
import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./Recipe"
import { getRecipeFromMistral } from "./ai"

export default function Main() {

    let [lists, setLists ] = useState([])
    const [recipe, setRecipe] = useState(false)
    const [loading, setLoading] = useState(false);
    const spinnerRef = useRef(null);

    async function getRecipe() {
        setLoading(true)
        setTimeout(() => {
            if (spinnerRef.current) {
              spinnerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        const recipeMarkdown = await getRecipeFromMistral(lists)
        setRecipe(recipeMarkdown)
        setLoading(false)
    }
    
    function handle(formData) {
        const newIngredient = formData.get("ingredient")
        setLists(prevLists => [...prevLists, newIngredient])
    }

    

    return(
        <main className="heroSection">
            <form action={handle} className="add-ingredient-form">
                <input 
                    type="text"
                    placeholder="e.g.Chicken"
                    aria-label="Add Ingredient"
                    name="ingredient"
                    required
                />

                <button>Add Ingredients</button>
            </form>

            {lists.length > 0 &&
                <IngredientsList
                    ingredients={lists}
                    getRecipe={getRecipe}
                />
            }

            {loading && (
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
            )}

            {recipe && <ClaudeRecipe recipe={recipe}/>}
        </main>
    )
}