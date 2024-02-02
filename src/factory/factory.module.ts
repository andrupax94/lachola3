
import { Injectable, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class FactoryService {

    constructor(private router: Router) { }


    public buscarPais(cadena: string, paises: { name: string, nameESP: string, nameALT?: string, country: string, code: string }[]): string {
        // Normalizar la cadena eliminando acentos y convirtiéndola a minúsculas
        const cadenaNormalizada = cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if (paises === undefined || paises === null)
            return "eu";
        // Recorrer el array de países
        for (let pais of paises) {
            const nombrePaisNormalizado = pais.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const nombrePaisEspNormalizado = pais.nameESP.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const nombrePaisAltNormalizado = pais.nameALT ? pais.nameALT.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;
            const paisNormalizado = pais.country.toLowerCase();
            const codigoNormalizado = pais.code.toLowerCase();
            if (
                cadenaNormalizada === nombrePaisNormalizado ||
                cadenaNormalizada === nombrePaisEspNormalizado ||
                (pais.nameALT && cadenaNormalizada === nombrePaisAltNormalizado) ||
                cadenaNormalizada === paisNormalizado ||
                cadenaNormalizada === codigoNormalizado
            ) {
                return pais.country.toLowerCase();
            }
        }

        // Verificar coincidencia con las primeras tres palabras de la cadena
        const primerasTresPalabras = cadena.split(' ').slice(0, 3).join(' ');
        for (let pais of paises) {
            if (
                primerasTresPalabras.toLowerCase().includes(pais.name.toLowerCase()) ||
                primerasTresPalabras.toLowerCase().includes(pais.nameESP.toLowerCase()) ||
                (pais.nameALT && primerasTresPalabras.toLowerCase().includes(pais.nameALT.toLowerCase()))
            ) {
                return pais.country.toLowerCase();
            }
        }

        // Verificar coincidencia con las tres últimas palabras de la cadena
        const ultimasTresPalabras = cadena.split(' ').slice(-3).join(' ');
        for (let pais of paises) {
            if (
                ultimasTresPalabras.toLowerCase().includes(pais.name.toLowerCase()) ||
                ultimasTresPalabras.toLowerCase().includes(pais.nameESP.toLowerCase()) ||
                (pais.nameALT && ultimasTresPalabras.toLowerCase().includes(pais.nameALT.toLowerCase()))
            ) {
                return pais.country.toLowerCase();
            }
        }

        // Si no se encontró ninguna coincidencia, devolver "EU"
        return "eu";
    }


    public agregarOEliminarElemento<T extends { id: any }>(elemento: T, array: T[], onlyReturn: boolean = false): T[] | boolean {
        const elementoId = elemento.id;

        if (array.some(item => item.id === elementoId)) {
            // Si el elemento ya existe, eliminarlo
            return onlyReturn ? true : array.filter(item => item.id !== elementoId);
        } else {
            // Si el elemento no existe, agregarlo
            return onlyReturn ? false : [...array, elemento];
        }
    }
    public convertToBase64(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                const base64String = e.target.result;
                resolve(base64String);
            };

            reader.onerror = (e: any) => {
                reject(e);
            };

            reader.readAsDataURL(file);
        });
    }
    public static isValidDateFormat3(dateString: string) {
        // Expresión regular para el formato "DD-MM-YYYY"
        const regex = /^\d{2}-\d{2}-\d{4}$/;

        // Comprobar si la cadena coincide con la expresión regular
        return regex.test(dateString);
    }
    public differenceInDays(valor: string, date2: Date = new Date()): number {
        // Convertir las fechas a milisegundos desde el 1 de enero de 1970 (época)
        let date1;
        if (FactoryService.isValidDateFormat3(valor)) {
            let partes = valor.split("-");
            // Crear un nuevo string con el formato reconocido por Date ("YYYY-MM-DD")
            let nuevoFormato = partes[2] + "-" + partes[1] + "-" + partes[0];
            // Crear la fecha utilizando el nuevo formato
            date1 = new Date(nuevoFormato);
        }
        else {
            date1 = new Date(valor);
        }
        const time1 = date1.getTime();
        const time2 = date2.getTime();

        // Calcular la diferencia en milisegundos
        const timeDiff = time1 - time2;

        // Calcular la diferencia en días
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        return daysDiff;
    }
    public getsvg(element: HTMLElement, version: string = '', renderer?: Renderer2) {

        let svg: any = element.getAttribute('getsvg' + version);
        if (svg === null || svg === "")
            return false;
        if (svg?.indexOf(',') !== -1) {
            svg = svg?.split(',');
        } else {
            var aux = svg;
            svg = [];

            svg[0] = aux;
            svg[1] = 'no';
        }
        let final;
        if (svg[0].indexOf('/-.-/') !== -1) {
            final = svg[0].split('/-.-/')[0];
        } else {
            final = svg[0];
        }
        if (final.indexOf('assets') === -1)
            final = '/assets/' + final;
        let elementChild;
        if (version === '') {
            $.get(final, (htmlexterno) => {
                var base64c = htmlexterno.split('/');

                if (base64c[0] === 'data:image') {
                    $(element).css('background-size', 'contain');
                    $(element).css('background-repeat', 'no-repeat');
                    $(element).css('background-image', 'url("' + htmlexterno + '")');
                } else {

                    $(element).prepend(htmlexterno);
                    $(element).children('svg').attr('width', $(element).css('width'));
                    $(element).children('svg').attr('height', $(element).css('height'));
                    var fuck = $(element).height();
                    if (svg[1] !== 'no') {
                        $(element).find('path').css("fill", svg[1]);
                        $(element).find('polygon').css("fill", svg[1]);
                    }
                }
            }, "html").done(function () {

            });
            return true;
        }
        else {
            let img;
            if (renderer !== undefined)
                img = renderer!.createElement('div');
            else
                img = document.createElement('div');
            img.className += 'getsvg' + version;
            element.appendChild(img);
            elementChild = $(element).find('.getsvg' + version);
            if (elementChild == null)
                return false;
            else {
                if (version == '3') {
                    elementChild.css('-webkit-mask-image', 'url(' + final + ')');
                    elementChild.css('-webkit-mask-repeat', 'no-repeat');
                    elementChild.css('-webkit-mask-size', 'contain');
                    elementChild.css('mask-image', 'url(' + final + ')');
                    elementChild.css('mask-repeat', 'no-repeat');
                    elementChild.css('mask-size', 'contain');

                    if (svg[1] == 'no') {
                        elementChild.css('background-color', '#ffffff');
                    }
                    else {
                        elementChild.css('background-color', svg[1]);
                    }

                }
                else if (version == '2') {
                    elementChild.css('background-image', 'url(' + final + ')');
                    elementChild.css('background-repeat', 'no-repeat');
                    elementChild.css('background-size', 'contain');
                    elementChild.css('background-position', 'center');
                }

                elementChild.css('width', '100%');
                elementChild.css('height', '100%');
                elementChild.css('margin', '0 auto');
                return true;
            }
        }
    };
    public generaID(element: HTMLElement) {
        let ramd = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        $(element).attr('id', ramd);
        return ramd;
    }
    public anima(valor: string) {

        let element = $(valor);

        element.css('animation-play-state', 'paused');
        var count = parseInt(element.css('animation-iteration-count'));
        element.css('animation-iteration-count', count + 1);
        element.css('animation-play-state', 'running');

    }
    public generaRandomString(num: number, tipoValor = "alfanumerico") {
        var characters: string = '';
        if (tipoValor === "alfa")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        else if (tipoValor === "numerico")
            characters = '0123456789';
        else if (tipoValor === "alfanumerico")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        var charactersLength: number = characters.length;
        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result1;
    }
    public generaRandomNumber(a: number, b: number) {
        return Math.round(Math.random() * (b - a) + (a));
    }

    public convertTZ(date: string) {
        var dt = new Date(date);
        return (dt.toLocaleString());
    }

    public getOffset(el: HTMLElement) {
        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;

        }
        return { top: _y, left: _x };
    }

    public stringToArray(valor: string, separator: string = ',') {
        var aux = undefined;
        if (valor !== undefined && typeof valor === 'string') {
            aux = valor.split(separator);
            if (aux !== undefined) {
                if (typeof aux === 'string') {
                    aux = [aux];
                }
            }
        } else {
            aux = valor;
        }
        return aux;
    };
    public arrayToString(valor: Array<any>, separator: string = ',', column: string | boolean = false) {
        var aux = "";

        if (valor === undefined)
            return 'Valor Indefinido';
        else if (typeof (valor) === 'string')
            return valor;
        else if (Array.isArray(valor) && valor.length === 0)
            return '';

        if (Array.isArray(valor)) {
            valor.forEach((element, i) => {
                if (typeof element === 'object' && element !== null) {
                    // Si es un objeto, trata cada par clave-valor
                    Object.keys(element).forEach((key, j) => {
                        aux += key + ':' + element[key];
                        if (j < Object.keys(element).length - 1) {
                            aux += separator;
                        }
                    });
                } else {
                    // Si no es un objeto, trata el elemento directamente
                    aux += element;
                }

                if (i < valor.length - 1) {
                    aux += separator;
                }
            });
        } else {
            return 'Tipo no compatible';
        }

        return aux;
    }

    public comparaArrays(arr1: Array<any>, arr2: Array<any>) {
        if (this.arrayToString(arr1) === this.arrayToString(arr2))
            return true;
        else
            return false;
    }
    public randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    public rgb2hex(rgbI: string) {
        let rgb: any = rgbI.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
    };
    public hex(xI: string) {
        let x = parseInt(xI);
        var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
        return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    };
    //  focusPlaceholderTop y focusoutPlaceholderTop son funciones
    //  de la directiva placeholdertop
    public focusPlaceholderTop(e: any, element: JQuery) {
        if (e != undefined) {
            e.stopPropagation();
        }
        var aux = (parseInt(element.css('font-size')) - 2 + 'px');
        var hijodiv = element.children('div').last();
        var hijoh5 = element.children('div').children('h5');
        hijoh5.css('font-size', aux);
        hijodiv.css('height', hijoh5.height() + 'px');
        hijodiv.css('top', '-' + ((hijoh5.height() as number) / 2) + 'px');

    };
    public focusoutPlaceholderTop(e: any, element: JQuery) {
        e?.stopPropagation();
        if (element.children('input').val() == "") {
            var aux = (parseInt(element.css('font-size')) + 'px');
            var hijodiv = element.children('div').last();
            var hijoh5 = element.children('div').children('h5');
            hijoh5.css('font-size', aux);
            hijodiv.css('height', element.height() + 'px');
            hijodiv.css('top', '0px');
        }
    };
}
