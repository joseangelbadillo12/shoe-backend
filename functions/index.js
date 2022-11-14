const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')

const app = express()
admin.initializeApp({
    credential: admin.credential.cert('./permissions.json'),
})
const db = admin.firestore()

app.get('/hello-world', (req, res) =>{
    return res.status(200).json({message: 'Hello World'})
});

app.post('/api/products', async (req, res) =>{
    try {
        await db.collection('products')
                .doc()
                .create({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    stock: req.body.stock,
                    rating: req.body.rating,
                    reviews: req.body.reviews
    })
        return res.status(200).json()
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
});

app.get("/api/products/:id", (req, res) =>{
    (async () =>{
        try {
            const doc = db.collection("products").doc(req.params.id);
            const item = await doc.get();
            const response = item.data();
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).send(error)
        }
    })();
});

app.get("/api/products", async (req, res) => {
    try {
        const query = db.collection('products');
        const querySnapshot = await query.get()
        const docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
            stock: doc.data().stock,
            rating: doc.data().rating,
            reviews: doc.data().reviews
        }));
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json();
    }
})

app.get('/products')
exports.app = functions.https.onRequest(app);