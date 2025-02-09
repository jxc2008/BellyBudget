const axios = require('axios');
const config = require('./config.js')

async function createCustomer(first, last) {
  try {
    const response = await axios.post(
      `${config.NESSIE_BASE_URL}customers?key=${config.NESSIE_API_KEY}`,
      {
        first_name: first,
        last_name: last,
        address: {
          street_number: '1234',
          street_name: 'Main Street',
          city: 'Springfield',
          state: 'VA',
          zip: '12345'
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    ); 
    console.log('Created customer:', response.data);
  } catch (error) {
    console.error('Error creating customer:', error.response?.data || error.message);
  }
}

async function getCustomer() {
    try {
        const response = await axios.get(
            `${config.NESSIE_BASE_URL}customers?key=${config.NESSIE_API_KEY}`,
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Created customer:', response.data);
    } catch (error) {
        console.error('Error creating customer:', error.response?.data || error.message);
    }
}



async function deleteItAll() {
    try {
        const deletion = await axios.delete(
            `${config.NESSIE_BASE_URL}data?type=Customers&key=${config.NESSIE_API_KEY}`,
            {headers: {'Content-Type': 'application/json', 'type': 'Customers'}}
        );
    } catch (error) {
        console.error('Error creating customer:', error.response?.data || error.message);
    }
}

createCustomer('Eshaan', 'Saxena');