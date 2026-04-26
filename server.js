const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/movieapi/add-reviews' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const newReview = JSON.parse(body);
            const addedReviews = await addReview(newReview);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(addedReviews));
        });
    } 
    else if (req.url === '/movieapi/update-review' && req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const updatedReview = JSON.parse(body);
            const result = await updateReview(updatedReview);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }
}); 

server.listen(3000, () => {
    console.log('Server running on: 3000');
});

const addReview = async (newReview) => {
    const datapath = path.join(__dirname, 'data', 'movies.json');
    let reviewsData = await fs.promises.readFile(datapath, 'utf-8');
    let reviewsArray = JSON.parse(reviewsData);
    
    let id = (reviewsArray.length > 0) ? reviewsArray[reviewsArray.length - 1].id + 1 : 1;
    newReview.id = id; 
    
    reviewsArray.push(newReview);
    await fs.promises.writeFile(datapath, JSON.stringify(reviewsArray, null, 2));
    
    return reviewsArray;
};

const updateReview = async (movie) => {
    const datapath = path.join(__dirname, 'data', 'movies.json');
    const data = await fs.promises.readFile(datapath, 'utf-8');
    const reviewsArray = JSON.parse(data);

    const index = reviewsArray.findIndex(m => m.id === movie.id);

    if (index !== -1) {
        reviewsArray[index] = movie;
        await fs.promises.writeFile(datapath, JSON.stringify(reviewsArray, null, 2));
    }
    return movie;
};