const axios = require('axios');
const fs = require('fs');

const API_KEY = 'AIzaSyDwohSwuXChpWsPAw7i6fh9KoYbbLWjXvY'; // Ganti dengan API key-mu

const keywords = [
  // Jakarta Umum
  'club di Jakarta',
  'nightclub Jakarta',
  'bar Jakarta',
  'lounge Jakarta',
  'karaoke Jakarta',
  'disco Jakarta',
  'pub Jakarta',
  'resto bar Jakarta',
  'dj club Jakarta',
  'tempat hiburan malam Jakarta',
  'tempat dugem Jakarta',

  // Jakarta Pusat
  'club di Jakarta Pusat',
  'nightclub Jakarta Pusat',
  'bar Jakarta Pusat',
  'lounge Jakarta Pusat',
  'karaoke Jakarta Pusat',

  // Jakarta Utara
  'club di Jakarta Utara',
  'nightclub Jakarta Utara',
  'bar Jakarta Utara',
  'lounge Jakarta Utara',
  'karaoke Jakarta Utara',

  // Jakarta Selatan
  'club di Jakarta Selatan',
  'nightclub Jakarta Selatan',
  'bar Jakarta Selatan',
  'lounge Jakarta Selatan',
  'karaoke Jakarta Selatan',

  // Jakarta Barat
  'club di Jakarta Barat',
  'nightclub Jakarta Barat',
  'bar Jakarta Barat',
  'lounge Jakarta Barat',
  'karaoke Jakarta Barat',

  // Jakarta Timur
  'club di Jakarta Timur',
  'nightclub Jakarta Timur',
  'bar Jakarta Timur',
  'lounge Jakarta Timur',
  'karaoke Jakarta Timur',

  // Cibubur
  'club di Cibubur',
  'nightclub Cibubur',
  'bar Cibubur',
  'lounge Cibubur',
  'karaoke Cibubur',

  // Bogor
  'club di Bogor',
  'nightclub Bogor',
  'bar Bogor',
  'lounge Bogor',
  'karaoke Bogor',

  // Tangerang
  'club di Tangerang',
  'nightclub Tangerang',
  'bar Tangerang',
  'lounge Tangerang',
  'karaoke Tangerang'
];


async function fetchAllClubs() {
  const allClubs = [];
  const uniquePlaces = new Set(); // Untuk menghindari duplikasi berdasarkan place_id

  for (const searchQuery of keywords) {
    let nextPageToken = null;
    let page = 1;

    do {
      const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        searchQuery
      )}&key=${API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;

      console.log(`Fetching page ${page} for keyword "${searchQuery}"...`);
      const textSearchResponse = await axios.get(textSearchUrl);
      const clubs = textSearchResponse.data.results;

      for (const club of clubs) {
        if (!uniquePlaces.has(club.place_id)) {
          uniquePlaces.add(club.place_id);

          const placeId = club.place_id;
          const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,geometry&key=${API_KEY}`;
          const detailResponse = await axios.get(detailUrl);
          const details = detailResponse.data.result;

          allClubs.push({
            Name: details.name || '',
            Address: details.formatted_address || '',
            Phone: details.formatted_phone_number || '',
            Latitude: details.geometry?.location?.lat || null,
            Longitude: details.geometry?.location?.lng || null,
          });

          // Delay kecil biar aman dari rate limit Google
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      nextPageToken = textSearchResponse.data.next_page_token;
      page++;

      if (nextPageToken) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } while (nextPageToken);
  }

  // Simpan data ke file JSON dengan indentasi 2 (biar rapih)
  fs.writeFile('clubs_in_jakarta.json', JSON.stringify(allClubs, null, 2), (error) => {
    if (error) {
      console.error(error);
      throw error;
    }

    console.log(`✅ clubs_in_jakarta.json berhasil disimpan dengan ${allClubs.length} data.`);
  });
}

fetchAllClubs();
