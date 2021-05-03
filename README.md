# HackerNewsRN
A mobile app using React Native that pulls articles from the Hacker News stories API endpoint and display them along with their score, title, url, and author details

# Features
1. Pick 20 new articles from the Hacker News stories API endpoint 
2. Show loader till stories are ready to be displayed
3. Proper error handling in case of API failure or rate-limiting by Hacker News
4. Sort option based on score, title, author
5. Poll periodically (every 5 mins) and show a count of number of new stories since last poll as well as highlight the new stories since last poll
6. On every poll the current sorting option should remain unchanged e.g. if user has sorted the list of stories based on score then that order should remain unchanged
