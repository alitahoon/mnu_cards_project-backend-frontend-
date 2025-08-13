import requests

# Replace with your Ngrok URL and national ID
ngrok_url = "https://7bf01075000c.ngrok-free.app/students/getStudentByNationalId"
national_id = "30802191401097"



params = {
    "nationalID": national_id
}

try:
    response = requests.get(ngrok_url, params=params)
    response.raise_for_status()  # Raise exception for HTTP errors
    data = response.json()
    print("Full response:", data)
except requests.exceptions.HTTPError as errh:
    print("HTTP Error:", errh)
except requests.exceptions.ConnectionError as errc:
    print("Error Connecting:", errc)
except requests.exceptions.Timeout as errt:
    print("Timeout Error:", errt)
except requests.exceptions.RequestException as err:
    print("Something went wrong:", err)
