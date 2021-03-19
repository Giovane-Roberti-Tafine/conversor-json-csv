import '../styles/stylesheet.scss';
import 'bootstrap/dist/js/bootstrap.min.js';
import { saveAs } from 'file-saver';

window.onload = function () {
    new ConverterJsonCsv();
};

class ConverterJsonCsv {
    public textJsonCsv = (<HTMLTextAreaElement>document.getElementById("textJsonCsv"));
    public incluirNullable = <HTMLInputElement>document.getElementById("incluirNullable");
    public resultJsonCsv = (<HTMLTextAreaElement>document.getElementById("resultJsonCsv"));
    public textFile = (<HTMLElement>document.getElementById("text-file"));
    public timeAlert = null;
    public timeClick = null;
    public longClick = false;
    public typeFile: 'application/json' | 'application/vnd.ms-excel';

    constructor() {
        $(function () {
            (<any>$('[data-toggle="tooltip"]')).tooltip();
        });
        document.getElementById("converterCsv").onclick = () => this.converterCsv();
        document.getElementById("converterJson").onclick = () => this.converterJson();
        document.getElementById("closeAlert").onclick = () => $('#myAlert').hide('slow');

        document.getElementById("selecao-arquivo").onchange = (ev) => this.selecaoArquivo(ev);
        document.getElementById("copiar-resultado").onclick = () => this.copiarResultado();

        document.getElementById("limpar-campos").onmousedown = () => {
            this.timeClick = setTimeout(() => {
                this.limparCampos();
            }, 2000);
        };
        document.getElementById("limpar-campos").onmouseup = () => {
            clearTimeout(this.timeClick);
            this.limparResultado();
        };

        document.getElementById("salvar-resultado").onclick = () => this.salvarResultado();
        this.textJsonCsv.value = `[{"Id": "1","UserName": "Sam Smith","awd": "12"},{"Id": "2","UserName": "Fred Frankly","awd": ""},{"Id": "1","UserName": "Zachary Zupers","awd": ""}]`;
        this.textFile.innerText = 'Upload de arquivo';
    }

    converterCsv(): void {
        let jsonConvertido = null;
        // Testando o valor se esta valido
        try {
            jsonConvertido = JSON.parse(this.textJsonCsv.value.trim());
        } catch (error) {
            this.alert('Entrada Inválida');
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
            let arrayKeys: string[] = [];
            (jsonConvertido as Array<any>).map((element) => {
                Object.keys(element).forEach(element => {
                    if (arrayKeys.indexOf(element) === -1)
                        arrayKeys.push(element);
                });
            });
            if (this.incluirNullable.checked) {
                keys = arrayKeys.join(';');
            } else {
                let keysNullable: string[] = [];
                jsonConvertido.map((element) => {
                    arrayKeys.map((key, index, array) => {
                        if (!element[key] && keysNullable.indexOf(key) === -1) {
                            keysNullable.push(key);
                        }
                    });
                });

                keysNullable.map((key) => {
                    let index = arrayKeys.indexOf(key);
                    arrayKeys.splice(index, 1);
                });

                keys = arrayKeys.join(';');
            }

            jsonConvertido.map(element => {
                let strValues = "";

                if (this.incluirNullable.checked) {
                    arrayKeys.map((key, i, array) => {
                        strValues += (element[key] ?? '') + (i === array.length - 1 ? '' : ';');
                    });
                } else {
                    Object.keys(element).map((key, i, array) => {
                        if (arrayKeys.indexOf(key) !== -1) {
                            strValues += (element[key] ?? '') + (i === arrayKeys.length - 1 ? '' : ';');
                        }

                    });

                }

                str += "\n" + strValues;
            });

            str = keys + str;
        }

        this.typeFile = 'application/vnd.ms-excel';
        this.resultJsonCsv.value = str;
    }

    converterJson(): void {
        const arrayTest = this.textJsonCsv.value.trim().split(',');

        if (!arrayTest) return this.alert('Entrada Inválida');

        for (var i = 0; i < arrayTest.length; i++) {
            const item = String(arrayTest[i]).trim();

            if (!item.length) return this.alert('Entrada Inválida');
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
                this.alert('Entrada Inválida');
                return;
            }

            if (!this.incluirNullable.checked) {
                let jsonNullable = JSON.parse(jsonConvertido);
                let objNullable: string[] = [];
                jsonNullable.map((obj) => {
                    props.map((key) => {
                        if (!obj[key]) {
                            objNullable.indexOf(key) !== -1 ? '' : objNullable.push(key);
                        }
                    });
                });

                if (objNullable.length !== 0) {
                    jsonNullable.map((obj) => {
                        objNullable.map((keyNullable) => {
                            delete obj[keyNullable];
                        });

                    });

                    jsonConvertido = JSON.stringify(jsonNullable);
                }
            }
        }
        this.typeFile = 'application/json';
        this.resultJsonCsv.value = jsonConvertido;

    }

    alert(mensagem?: string): void {
        $('#text-alert').empty().append(mensagem);
        $('#myAlert')
            .show('fast')
            .removeClass('alert-success')
            .addClass('alert-danger');
        clearTimeout(this.timeAlert);
        this.timeAlert = setTimeout(() => {
            $('#myAlert').hide('slow');
        }, 2000);
    }

    async selecaoArquivo(event) {
        const reader = new FileReader();
        if ((event.target as HTMLInputElement).files[0]) {
            let resolve = await new Promise<any>((resolve) => {
                reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
                this.textFile.innerText = (event.target as HTMLInputElement).files[0].name;
                reader.onload = () => {
                    let str = reader.result.toString().split(',');
                    resolve(atob(str[1]));
                };
            });
            $("#selecao-arquivo").val('');
            this.textJsonCsv.value = resolve;
        }
    }

    limparResultado(): void {
        if (!this.longClick) {
            this.resultJsonCsv.value = '';
            this.longClick = false;
        }
    }

    limparCampos(): void {
        clearTimeout(this.timeClick);
        this.textJsonCsv.value = '';
        this.resultJsonCsv.value = '';
        this.textFile.innerText = 'Upload de arquivo';
    }

    copiarResultado(): void {
        this.resultJsonCsv.select();
        document.execCommand('copy');
        $('#text-alert').empty().append('Resultado Copiado');
        $('#myAlert')
            .show('fast')
            .removeClass('alert-danger')
            .addClass('alert-success');
        clearTimeout(this.timeAlert);
        this.timeAlert = setTimeout(() => {
            $('#myAlert').hide('slow');
        }, 2000);
    }

    salvarResultado(): void {
        if (!this.resultJsonCsv.value) return this.alert('Nenhum Resultado Obtido');
        let nomeArquivo = '';
        if (this.typeFile === 'application/json') {
            nomeArquivo = 'resultado.json';
        } else {
            nomeArquivo = 'resultado.csv';
        }
        var file = new File([this.resultJsonCsv.value], nomeArquivo, { type: `${this.typeFile};charset=utf-8` });
        saveAs(file);
    }
}