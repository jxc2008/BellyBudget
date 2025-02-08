import requests

def get_location():
    try:
        response = requests.get("https://ipinfo.io/json")
        data = response.json()
        return {
            "ip": data.get("ip"),
            "city": data.get("city"),
            "region": data.get("region"),
            "country": data.get("country"),
            "loc": data.get("loc")  # Latitude,Longitude
        }
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    location = get_location()
    print(location)