// import 'bootstrap';
// import './css/stylesheet.scss';
// import * as $ from 'jquery';
window.onload = function () {
    new ConverterJsonCsv();
};
class ConverterJsonCsv {
    constructor() {
        this.textJsonCsv = document.getElementById("textJsonCsv");
        this.incluirNullable = document.getElementById("incluirNullable");
        this.resultJsonCsv = document.getElementById("resultJsonCsv");
        document.getElementById("converterCsv").onclick = () => this.converterCsv();
        document.getElementById("converterJson").onclick = () => this.converterJson();
        // document.getElementById("closeAlert").onclick = () => $('#myAlert').hide('slow');
        this.textJsonCsv.value = `Id,UserName
1,Sam Smith
2,Fred Frankly
1,Zachary Zupers`;
    }
    converterCsv() {
        let jsonConvertido = null;
        // Testando o valor se esta valido
        try {
            jsonConvertido = JSON.parse(this.textJsonCsv.value.trim());
        }
        catch (error) {
            this.alert();
            return;
        }
        // Verificando se o JSON é objeto unico, sem estar em array
        let str = '';
        if (jsonConvertido[0] === undefined) {
            Object.keys(jsonConvertido).forEach((element, index, array) => {
                str += element + (index === array.length - 1 ? '' : ';');
            });
            str += "\n";
            Object.values(jsonConvertido).forEach((el, i, array) => {
                str += el + (i === array.length - 1 ? '' : ';');
            });
        }
        else {
            let keys = '';
            if (this.incluirNullable.checked) {
                let arrayKeys = [];
                jsonConvertido.map((element) => {
                    Object.keys(element).forEach(element => {
                        if (arrayKeys.indexOf(element) === -1)
                            arrayKeys.push(element);
                    });
                });
                keys = arrayKeys.join(';');
            }
            else {
                Object.keys(jsonConvertido[0]).forEach((element, index, array) => {
                    keys += element + (index === array.length - 1 ? '' : ';');
                });
            }
            jsonConvertido.forEach(element => {
                let strValues = "";
                Object.values(element).map((el, i, array) => {
                    if (this.incluirNullable.checked) {
                        strValues += el + (i === array.length - 1 ? '' : ';');
                    }
                    else if (i < keys.split(';').length) {
                        strValues += el + (i === keys.split(';').length - 1 ? '' : ';');
                    }
                });
                str += "\n" + strValues;
            });
            str = keys + str;
        }
        this.resultJsonCsv.value = str;
    }
    converterJson() {
        const arrayTest = this.textJsonCsv.value.trim().split(',');
        if (!arrayTest)
            return this.alert();
        for (var i = 0; i < arrayTest.length; i++) {
            const item = String(arrayTest[i]).trim();
            if (!item.length)
                return this.alert();
        }
        let arrayText = [];
        let props = [];
        arrayText = this.textJsonCsv.value.trim().replaceAll(',', ';').split(/[;]/);
        for (let el of arrayText) {
            if (/[\n|\n\r]/.test(el)) {
                props.push(el.split(/[\n|\n\r]/)[0]);
                break;
            }
            else {
                props.push(el);
            }
        }
        let arrayValue = this.textJsonCsv.value.trim().split(/[;]/);
        arrayValue = arrayValue.join(',').split(/[\n|\n\r]/);
        arrayValue.splice(0, 1);
        let jsonConvertido = '[';
        if (!arrayValue.length) {
            jsonConvertido += '{';
            props.map((prop, i, array) => {
                jsonConvertido += `"${prop}": "" ${i === array.length - 1 ? '' : ','}`;
            });
            jsonConvertido += '}]';
        }
        else {
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
            }
            catch (error) {
                this.alert();
                return;
            }
        }
        this.resultJsonCsv.value = jsonConvertido;
    }
    alert() {
        // $('#myAlert').show('fast');
        // setTimeout(() => {
        //     $('#myAlert').hide('slow');
        // }, 2000);
    }
}
//# sourceMappingURL=index.js.map