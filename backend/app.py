import requests

response = requests.get('https://ipinfo.io')
if response.status_code == 200:
    data = response.json()
    location = data.get('loc', 'N/A').split(',')
    city = data.get('city', 'N/A')
    region = data.get('region', 'N/A')
    country = data.get('country', 'N/A')
    print(f"Your location: {city}, {region}, {country}")
    print(f"Coordinates: {location}")
else:
    print("Unable to determine location.")