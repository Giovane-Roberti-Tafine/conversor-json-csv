import 'bootstrap';
import '../styles/stylesheet.scss';
import * as $ from 'jquery';

window.onload = function () {
    new ConverterJsonCsv();
};
class ConverterJsonCsv {
    public textJsonCsv = (<HTMLTextAreaElement>document.getElementById("textJsonCsv"));
    public incluirNullable = <HTMLInputElement>document.getElementById("incluirNullable");
    public resultJsonCsv = (<HTMLTextAreaElement>document.getElementById("resultJsonCsv"));

    constructor() {
        document.getElementById("converterCsv").onclick = () => this.converterCsv();
        document.getElementById("converterJson").onclick = () => this.converterJson();
        document.getElementById("closeAlert").onclick = () => $('#myAlert').hide('slow');
        this.textJsonCsv.value = `Id,UserName
1,Sam Smith
2,Fred Frankly
1,Zachary Zupers`;
        const objeto = {};
        console.log(objeto['spartan']);

    }

    converterCsv(): void {
        let jsonConvertido = null;
        // Testando o valor se esta valido
        try {
            jsonConvertido = JSON.parse(this.textJsonCsv.value.trim());
        } catch (error) {
            this.alert();
            return;
        }

        // Verificando se o JSON é objeto unico, sem estar em array
        let str: string = '';
        if (jsonConvertido[0] === undefined) {
            Object.keys(jsonConvertido).forEach((element, index, array) => {
                str += element + (index === array.length - 1 ? '' : ';');
            });

            str += "\n";

            Object.values(jsonConvertido).forEach((el, i, array) => {
                str += el + (i === array.length - 1 ? '' : ';');
            });
        } else {
            let keys: string = '';
            if (this.incluirNullable.checked) {
                let arrayKeys: string[] = [];
                (jsonConvertido as Array<any>).map((element) => {
                    Object.keys(element).forEach(element => {
                        if (arrayKeys.indexOf(element) === -1)
                            arrayKeys.push(element);
                    });
                });
                keys = arrayKeys.join(';');
            } else {
                Object.keys(jsonConvertido[0]).forEach((element, index, array) => {
                    keys += element + (index === array.length - 1 ? '' : ';');
                });
            }

            jsonConvertido.forEach(element => {
                let strValues = "";
                Object.values(element).map((el, i, array) => {
                    if (this.incluirNullable.checked) {
                        strValues += el + (i === array.length - 1 ? '' : ';');
                    } else if (i < keys.split(';').length) {
                        strValues += el + (i === keys.split(';').length - 1 ? '' : ';');
                    }
                });
                str += "\n" + strValues;
            });

            str = keys + str;
        }

        this.resultJsonCsv.value = str;
    }

    converterJson(): void {
        const arrayTest = this.textJsonCsv.value.trim().split(',');

        if (!arrayTest) return this.alert();

        for (var i = 0; i < arrayTest.length; i++) {
            const item = String(arrayTest[i]).trim();

            if (!item.length) return this.alert();
        }

        let arrayText = [];
        let props = [];
        arrayText = this.textJsonCsv.value.trim().replaceAll(',', ';').split(/[;]/);

        for (let el of arrayText) {
            if (/[\n|\n\r]/.test(el)) {
                props.push(el.split(/[\n|\n\r]/)[0]);
                break;
            } else {
                props.push(el);
            }
        }

        let arrayValue = this.textJsonCsv.value.trim().split(/[;]/);
        arrayValue = arrayValue.join(',').split(/[\n|\n\r]/);
        arrayValue.splice(0, 1);

        let jsonConvertido: string = '[';
        if (!arrayValue.length) {
            jsonConvertido += '{';
            props.map((prop, i, array) => {
                jsonConvertido += `"${prop}": "" ${i === array.length - 1 ? '' : ','}`;
            });

            jsonConvertido += '}]';
        } else {
            arrayValue.map((val, i, array) => {
                jsonConvertido += '{';
                const listValue = val.split(',');
                props.map((prop, i) => {
                    jsonConvertido += `"${prop}": "${listValue[i] ?? ''}"${i === props.length - 1 ? '' : ','}`;
                });
                jsonConvertido += `}${i === arrayValue.length - 1 ? '' : ','}`;
            });
            jsonConvertido += ']';

            try {
                JSON.parse(jsonConvertido);
            } catch (error) {
                this.alert();
                return;
            }
        }

        this.resultJsonCsv.value = jsonConvertido;

    }

    alert(): void {
        $('#myAlert').show('fast');
        setTimeout(() => {
            $('#myAlert').hide('slow');
        }, 2000);
    }


}