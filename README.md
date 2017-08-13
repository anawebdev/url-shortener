# API Project: URL Shortener Microservice

- - - 

### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`.
3. When I visit the shortened URL, it will redirect me to my original link.

- - - 

### Example usage

1. Post a link in the input area and pres "POST URL"
2. Copy the returned number and paste it in [URL]/(paste number here). It will redirect you to that page.

- - - 

### Technologies used

- HTML
- CSS
- Node.js
- Express.js
- MongoDB
- Mongoose

- - - 

*This is a **FreeCodeCamp** assignment.*