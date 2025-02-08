export async function GET() {
    const meals = [
      { name: "Chicken & Rice", price: 5 },
      { name: "Pasta & Salad", price: 7 },
      { name: "Sushi Roll", price: 10 },
    ];
  
    return new Response(JSON.stringify(meals), {
      headers: { "Content-Type": "application/json" },
    });
  }
  