# **App Name**: Dayflow Assistant

## Core Features:

- Manual Data Entry Forms: Easy to use forms for manual entry of work hours, tasks, expenses, and prayers, which allow the app to avoid needing database services
- Work Time Calculator: Calculates total working hours based on start and end times, excluding the automatic break time, and ensuring work only counts during allowed days and times
- Expense Calculator: Aggregates total expenses daily, weekly and monthly, showing data through simple, readable charts.
- Prayer Tracker: Tracks prayer completions, differentiating between prayers prayed in Jamaat or alone and flags any missed prayers, which all avoids the need for database services.
- Report Generator: Generates a simple report of daily, weekly and monthly work, tasks, expenses and prayers.
- User-Configurable Schedule: Allow the user to configure their normal office working hours, instead of locking in particular values
- Personalized Feedback Generation: Utilize an LLM tool via the Deeeseek API to receive and display a summary message of daily work pattern.

## Style Guidelines:

- Primary color: Light sea green (#20B2AA) to reflect productivity and calm.
- Background color: Very light gray (#F0F0F0) to create a clean, neutral backdrop.
- Accent color: Coral (#FF8040) for important actions and notifications.
- Body and headline font: 'PT Sans', a sans-serif font for a modern and accessible style.
- Use simple and clear icons from a consistent set (e.g. Font Awesome) for easy navigation.
- Implement a dashboard layout with cards for each tracked item to provide an 'at a glance' overview. Include a calendar for daily record navigation.
- Incorporate subtle transitions and feedback animations (e.g. a loading bar that fills as the AI compiles its summary).