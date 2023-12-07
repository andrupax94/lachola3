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
    def obtenerRespuesta(url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        if response.status_code == 200:
            return soup
        else:
            return False;

    def case1():
        soup=obtenerRespuesta('https://google.com')
        title = 'Hola'
        data = {
            'titulo': title,
            'enlaces': extraerDatos(soup)
        }
        return data

    def case2():

        return "https://festhome.com/festivals"

    def case3():

        return "https://filmfreeway.com/festivals"

    def default():
        return "Caso por defecto"

    # Definir un diccionario que mapea valores a funciones
    switch_dict = {
        "google": case1,
        "festhome": case2,
        "filmfreeway": case3,
    }

    # Definir la función switch que selecciona y ejecuta la función adecuada
    def switch(case):
        return switch_dict.get(case, default)()

    # Ejemplo de uso
    resultado = switch(url)
    return resultado


def extraerDatos(soup):
    links = soup.find_all('a')
    enlaces = [link['href'] for link in links]
    return enlaces

# Obtener datos en formato JSON
def init(url):
  return json.dumps(obtenerPagina(url), ensure_ascii=True, indent=2)


# Imprimir la salida JSON directamente
print(init(url))

