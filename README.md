BellyBudget
===========

BellyBudget is a personalized meal planning and budgeting web app that helps you plan meals, manage your food budget, and discover dining experiences tailored just for you!

Survey & Preferences
--------------------
BellyBudget starts with a friendly, multi-step survey where you share your dietary restrictions, favorite cuisines, meal frequency, dining preferences, and budget. Your responses are securely saved and used to craft a custom meal plan just for you.

Meal Plan Generation
--------------------
Using your survey data, BellyBudget fetches curated restaurant suggestions from an external API and generates a personalized meal plan. It rotates options across breakfast, lunch, and dinner throughout the week so you get a variety of choices.

Calendar View
-------------
Your custom meal plan is displayed on an interactive calendar that highlights the next upcoming occurrence for each weekday. This clear, visual layout helps you easily see what’s planned for each day.

Firebase Integration
--------------------
BellyBudget leverages Firebase for user authentication and real-time data storage. Survey responses and generated meal plans are stored in Firestore, ensuring your data is always secure and up-to-date.

Requirements
------------
- Node.js (>= 14)
- A Firebase project configured with Authentication and Firestore

Running It Yourself
-------------------
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/belly-budget.git
   cd belly-budget
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Configure your credentials in lb/firebase.ts:
4. Start the development server:
   ```bash
   npm run dev
   ```
Feature Requests
-------------------
Have a feature idea or a suggestion? Feel free to contact any of the developers via the about page!
