
export async function geocodeLocation(location) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;

        const response = await fetch(url, {
            headers: { "User-Agent": "MajorProject/1.0 (durgachaurasia517@gmail.com)" }
        });

        const data = await response.json();
        // console.log(data);
        if(data && data.length > 0){
            return data[0];
        } else {
            console.warn("⚠️ No result found for:", location);
            return "can'nt find location";
        }

        
    }catch(err){
        console.error("❌ Error fetching geocode:", err);
        return null;
    }

}
