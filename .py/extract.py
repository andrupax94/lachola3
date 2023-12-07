import requests
from bs4 import BeautifulSoup
import json
import sys

# Obtener el parámetro desde la línea de comandos
if len(sys.argv) != 2:
    print("Uso: python estract.py")
    sys.exit(1)

url = sys.argv[1]

# Ahora puedes usar el parámetro como lo necesites en tu script
def obtenerPagina(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.find(id='SIvCob').text
        data = {
            'titulo': title,
            'enlaces': extraerDatos(soup)
        }
        return data
    else:
        return {'error': f'Error al hacer la solicitud. Código de estado: {response.status_code}'}

def extraerDatos(soup):
    links = soup.find_all('a')
    enlaces = [link['href'] for link in links]
    return enlaces

# Obtener datos en formato JSON
def init(url):
  return json.dumps(obtenerPagina(url), ensure_ascii=True, indent=2)


# Imprimir la salida JSON directamente
print(init(url))

