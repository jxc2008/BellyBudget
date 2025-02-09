import axios from "axios";
import config from "./config.js";


async function run(){

    const url = "https://api.openai.com/v1/chat/completions";
    const apiKey = config.OPENAI;
    
    const jsonTEST = {
        name: "Mighty Quinn's Barbeque",
        opening_hours: { open_now: true },
        price_level: 2,
        rating: 4.3,
        scope: 'GOOGLE',
        vicinity: '75 Greenwich Avenue, New York',
        user_ratings_total: 3638
      };
      const jsonSTRING = JSON.stringify(jsonTEST);
        const requestBody = {
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: "Give an underestimate of the average price of 1 entree IN MONETARY VALUE of Olive Garden in NYC, AND ONLY RETURN AN INTEGER."}],
            max_tokens: 200
        };
    
        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            });
            console.log("Response:", response.data.choices[0].message.content);
        } catch (error) {
            console.error("Error fetching OpenAI response:", error.response ? error.response.data : error);
        }
}

run();
