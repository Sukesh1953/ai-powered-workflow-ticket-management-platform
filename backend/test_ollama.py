import requests

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "phi3",
        "prompt": "Explain AI in simple words",
        "stream": False
    }
)

print(response.json()["response"])