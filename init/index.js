
import mongoose from 'mongoose';
import initData from './data.js';
import Listing from '../models/listing.js';

// let mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;
main().then((res) => {
    console.log("connection successfull"); 
}).catch((err) => {
    console.log("ERROR: ", err);
    
});
async function main() {
    await mongoose.connect("mongodb+srv://mayank-mongodb:uotnw5Rwwk5yrVUf@cluster0.pxstwuq.mongodb.net/?appName=Cluster0");
}

const initDB = async () => {
    await Listing.deleteMany({});

    const cleanData = initData.data.map((obj) => {
        let coords = obj.geometry?.coordinates || [];

        // reverse coordinates if in wrong order
        // expected: [lng, lat]
        if (coords.length === 2) {
            let [a, b] = coords;

            // if a is latitude and b is longitude → swap
            // latitude range: -90 to +90
            // longitude range: -180 to +180
            if ((a >= -90 && a <= 90) && (b >= -180 && b <= 180)) {
                coords = [b, a];
            }
        }

        return {
            ...obj,
            owner: "691da0f96b68239272c88d24",

            geometry: {
                type: "Point",
                coordinates: coords
            }
        };
    });

    await Listing.insertMany(cleanData);
};

let res = await initDB();
console.log("data was initialized");

// Listing.find({}).then((res) => {
//     console.log(res.length);
// })
// console.log(initData.data);
