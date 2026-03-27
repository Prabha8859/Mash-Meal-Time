This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Working with the Food API

This project includes a simple food management API that interacts with a MongoDB database.

### Endpoints

| Method | URL              | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/api/foods`     | List all foods                  |
| POST   | `/api/foods`     | Create a new food record        |

The schema is defined in `src/models/Food.js`. When you send a POST request, include a JSON body similar to:

```json
{
  "name": "Spaghetti",
  "image": "https://example.com/spaghetti.jpg",
  "description": "Delicious pasta",
  "cookingMode": "cook-yourself",
  "nutrition": {"calories": 400}
}
```

Use Postman or any HTTP client to exercise the endpoints. Once the server is running (`npm run dev`), the database record will be saved if your `MONGODB_URI` is correctly set in `.env.local`.

> **Server fetch note:** the home page data loader uses an absolute URL (`http://localhost:3000/api/foods`) because server-side `fetch` cannot parse a relative path. You can override the base URL by defining `NEXT_PUBLIC_BASE_URL` in your environment if necessary.

### Category & item selection

The new form includes a **Category** dropdown with options such as "Vegetarian", "Non-Vegetarian", "Fast Food", etc. Selecting a category reveals a list of corresponding food items (e.g. "Paneer Butter Masala", "Butter Chicken", "Veg Burger") from which you can choose multiple entries. These values are sent in the `category` and `items` properties of the request body.

### Recipe entry

A checkbox labelled *"I want to add a recipe"* appears below the price/cuisine fields. When checked it displays two dynamic lists where you can add as many ingredients or steps as you like. There are no preset placeholders; the lists start empty and you type whatever you prefer or leave them blank. The resulting arrays are sent under the `recipe` key only when the checkbox is checked.

### Image upload mechanics

The add‑food form allows you to either upload an image file or provide an image URL. When uploading, the client converts the file to a Base64 string and sends it as the `image` property of the JSON payload. When supplying a URL, the string is forwarded directly.

### Sample JSON payload for Postman (using URL) with category/items and optional recipe

```json
{
  "name": "Paneer Tikka",
  "image": "https://example.com/paneer.jpg",
  "description": "Spicy grilled paneer cubes",
  "category": "vegetarian",
  "items": ["Paneer Butter Masala", "Shahi Paneer"],
  "cookingMode": "cook-yourself",
  "nutrition": {"calories": 320, "protein": 18, "carbs": 12, "fat": 22},
  "price": 220,
  "cuisine": ["indian"],
  "mealTiming": ["dinner"],
  "dietType": ["veg"],
  "healthGoals": ["muscle-gain"],
  "mood": ["excited"],
  "cookTime": 25,
  "ingredients": ["paneer","yogurt","spices","capsicum","onion"],
  "restrictedIngredients": [],
  "recipe": {"ingredients": ["200g paneer","1/2 cup yogurt","spices"],
              "steps": ["marinate paneer","skewer with veggies","grill for 15 minutes"]}
}
```

Or with base64 data for an uploaded image, include the `data:image/...;base64,...` string in `image` instead.


### UI components

- `src/components/AddFoodForm.jsx` – form to submit new food items.
- `src/components/FoodManager.jsx` – client container that renders the list (initial data passed from the server).
- `src/components/FoodList.jsx` – displays a card grid (three columns on large screens) of foods using the `Card` UI component.

The form and button share small reusable UI components under `src/components/ui`:
  - `Card.jsx` – wrapper with border, shadow and padding.
  - `Button.jsx` – styled button with hover/disabled states. The same component is used for navigation links and form submission.
  - `Input.jsx` – labeled input field used by the add‑food form.

`AddFoodForm` now includes fields for calories, cook time, price, and cuisine (comma‑separated list) in addition to name, image, description and cooking mode. You can extend the form further by following the same pattern (arrays are accepted as comma‑separated values).

A dedicated add‑food page lives at `app/add-food/page.jsx`. The home page (`app/page.js`) now shows an **"Add New Food"** button that navigates to this page; the form component is reused there.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
