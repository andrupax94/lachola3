
import { Injectable, Component, OnInit, Renderer2 } from '@angular/core';
import * as $from from 'jquery';
@Injectable({
    providedIn: 'root',
})
export class FactoryService {

    constructor() { }
    // segnda verson de getsvg agrega el svg pero con la propiedad mask-image en un elemento img sin ninguna etiqueta
    //  dentro nada dentro de el, el elemento tiene que tener un width y height

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
        valor.forEach((element, i) => {
            if (i + 1 === valor.length) {
                if (column === false)
                    aux = aux + element;
                if (column !== false)
                    aux = aux + element[column as string];
            } else {
                if (column === false)
                    aux = aux + element + separator;
                if (column !== false)
                    aux = aux + element[column as string] + separator;
            }
        });
        return aux;
    };
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
