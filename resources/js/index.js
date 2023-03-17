class Proceso {
    constructor(nombre, raf, ti, cod, mcod) {
        this.raf = raf;
        this.nombre = nombre;
        this.cod = cod;
        this.mcod = mcod;
        this.ti = ti;
        this.lSwap = [];
        this.mVar = [];
        this.mEti = [];
        this.pri = 0;
        this.puntE = 0;
        this.puntI = 0;
        this.punt = 0;
        this.puntS = 0;
        this.acum = 0;
        this.lVar = "";
        this.lEti = "";
        this.sal = "";
        this.imp = "";
    }
}
var ram = Array(100); //valor por defecto de la memoria
var MAX_BYTES = 102400; // 100 KB
var cod = "";
var puntI = 0; //Posicion base de los programas
var punt = 0; //Direccion cambiante de acuerdo a las lineas
var puntS = 0; //posicion final para proximo archivo
var puntE = 0; //Puntero de ejecicion 
var lin = 0; //Cantidad de lineas 
var acumulador = 0;
var comVar = []; //Arreglo temporal para comprobar variables
var eti = []; //Arreglo temporal para comprobar etiquetas
var files = false; //Multiples archivos
var cic = false; //Impide la recreacion de etiquetas en un ciclo
var lCod = ""; //lista de codigo
var oCod = "";
var linU = 0; //lineas usadas en total
var t = "//Factorial de N\nnueva unidad I 1\nnueva num I 5\nnueva resul I 1\nnueva ms C El_Factorial_es:\nlea num\n//Inicio de cliclo\ncargue num\nmultiplique resul\nalmacene resul\ncargue num\nreste unidad\nalmacene num\nvayasi cic fin\netiqueta cic 6\netiqueta fin 15\nmuestre ms\nimprima resul\nretorne";
var t1 = "//Escriba el código...\nnueva var C Hola Mundo!!!\ncargue var\nmuestre acumulador\nretorne";
var br = false;
var nomP = 0;
var lPro = new Array(0);
var tiempo = 0;
var lOr = new Array(0); //lista de orden de programas 
var cadSal = "";
var cadImp = "";
var lVar = "";
var lEti = "";
$(".tit").addClass('animated infinite pulse');
$("#ta").hide();
$("#ta1").hide();
$("#ta2").hide();
$("#tab").hide();
$("#ker").val("10");
$("#mem").val("100");
$("#text").val(t);
$("body").animate({ 'width': "100%" }, 1);
$("#algP").attr("disabled", "disabled");
$("#algM").attr("disabled", "disabled");
$("#ab").hide();
$('#form').addClass('animated zoomIn');

$(document).ready(function () {
    // verifico la sintaxis
    $(".ver").click(function () {
        var codigo = $("#text").val().split(String.fromCharCode(10));
        verificar(preparar(false, codigo, 0, codigo.length, 0));
    });
    // cargo el sistema
    $(".car").click(function () {
        ram = Array(parseInt($("#mem").val()));
        punt = parseInt($("#ker").val());
        if (parseInt($("#ker").val()) < parseInt($("#mem").val())) {
            $(".tit").removeClass('animated infinite pulse');
            $("#ta").show().addClass('animated bounceIn');
            $("#ta1").show().addClass('animated bounceIn');
            $("#ta2").show().addClass('animated bounceIn');
            $("#tab").show().addClass('animated bounceIn');
            for (i = 0; i < ram.length; i++)
                ram[i] = " ";
            $(".ver").removeAttr("disabled");
            $(".new").removeAttr("disabled");
            $(".gu").removeAttr("disabled");
            $("#ab").removeAttr("disabled");
            $(".car").attr("disabled", "disabled");
            $("#ker").attr("disabled", "disabled");
            $("#mem").attr("disabled", "disabled");
            $("#algP").removeAttr("disabled");
            $("#algM").removeAttr("disabled");
            verTab(ram, true);
        } else alert("Error en la asignacion de memoria");

        $(".car").hide();
        $(".car").addClass('animated bounceOut');
        $("label").hide(500);
        $("#mem").hide(500);
        $("#ker").hide(500);
        $("#ab").show(500);
        $("#form").animate({
            'width': "85%"
        }, 500);
        $("#algP").animate({
            'width': "100px"
        }, 1000);
        $("#algM").animate({
            'width': "100px"
        }, 1000);
        $("select").animate({
            'margin-left': '10px'
        }, 1000);
        $("button").animate({
            'margin-left': '1%'
        }, 1000);
        $("#ab").animate({
            'margin-left': '10px'
        }, 1000);
    });
    $(".com").click(function () {
        //los procesos se recorren de acuerdo al orden del algoritmo
        $("#err").removeClass('animated infinite bounce');
        $("#algP").attr("disabled", "disabled");
        $("#algM").attr("disabled", "disabled");
        if (document.getElementById('algP').selectedIndex == 1) {
            var q = prompt("Ingrese valor del Quantum");
        }
        for (var i = 0; i < lPro.length; i++) {
            if (i == 0) punt = parseInt($("#ker").val());
            acumulador = lPro[i].acum;
            preparar(true, lPro[i].cod, lPro[i].puntE, lPro[i].cod.length, i);
            compilar(lPro[i].mcod, false, lPro[i].puntE, lPro[i].mcod.length, i);
            console.log(puntE);
            lPro[i].acum = acumulador;
            lPro[i].puntE = puntE;
            lPro[i].puntI = puntI;
            lPro[i].punt = punt;
            lPro[i].puntS = puntS;
            puntE = 0;
            acumulador = 0;
            next();
        }

        for (i = 0; i < lPro.length; i++) lPro[i].puntE = 0;

        if (document.getElementById('algP').selectedIndex == 0)
            alert(Efecto(FCFS(lPro), "FCFS"));
        if (document.getElementById('algP').selectedIndex == 1)
            alert(Efecto(RR(lPro, q), "RR"));
        if (document.getElementById('algP').selectedIndex == 2)
            alert(Efecto(SJF(lPro), "SJF"));
        if (document.getElementById('algP').selectedIndex == 3)
            alert(Efecto(SRTN(lPro), "SRTN"));

        if (document.getElementById('algM').selectedIndex == 0) {
            for (var i = 0; i < lPro.length; i++) {
                alert(aMemV(lPro[i].lSwap, punt, lPro[i].nombre));
                lPro[i].lSwap = [];
            }
        }
        if (document.getElementById('algM').selectedIndex == 1) {
            var part = prompt("Ingrese tamaño de particiones");
            for (var i = 0; i < lPro.length; i++) {
                if (i > 0) alert(aMemF(lPro[i].lSwap, part * i, lPro[i].nombre, part));
                else alert(aMemF(lPro[i].lSwap, punt, lPro[i].nombre, part));
                lPro[i].lSwap = [];
            }
        }
        if (document.getElementById('algM').selectedIndex == 2) {
            for (var i = 0; i < lPro.length; i++) {
                alert(aMemP(lPro[i].lSwap, lPro[i].nombre));
                lPro[i].lSwap = [];
            }
        }
        verTab(ram, false);
    });
    $(".pas").click(function () {
        acumulador = 0;
        punt = parseInt($("#ker").val());
        preparar(true, lPro[0].cod, lPro[0].puntE, lPro[0].cod.length, 0);
        compilar(lPro[0].mcod, true, lPro[0].puntE, lPro[0].mcod.length, 0);
        aMemV(lPro[0].lSwap, punt, 0);
        verTab(ram, false);
        $("#err").removeClass('animated infinite bounce');
    });

});

function verTab(ram, tip) {
    var outerHTML = "";
    var icon = "",
        icon1 = "";
    for (var i = 0; i < ram.length; i++) {
        if (i < $("#ker").val()) icon1 = "/resources/images/nuevo.png";
        else icon1 = "/resources/images/guardar.png";

        if (ram[i][0] == "-") icon = "/resources/images/nuevo.png";
        else icon = "/resources/images/guardar.png"

        if (ram[i] != "" && ram[i] != " ") {
            if (i < 10) {
                outerHTML += '\n\
							<tr>\n\
								<td align="right"><img align="left" src=' + icon + ' height="20" width="20">' + '000' + i + '</td>\n\
								<td >' + ram[i] + '</td>\n\
							</tr>';
            } else
                if (i < 100) {

                    outerHTML += '\n\
							<tr>\n\
								<td align="right"><img align="left" src=' + icon + ' height="20" width="20">' + '00' + i + '</td>\n\
								<td >' + ram[i] + '</td>\n\
							</tr>';
                } else
                    if (i < 1000) {
                        outerHTML += '\n\
							<tr>\n\
								<td align="right"><img align="left" src=' + icon + ' height="20" width="20">' + '0' + i + '</td>\n\
								<td >' + ram[i] + '</td>\n\
							</tr>';
                    }
        } else {
            if (i < 10) {
                outerHTML += '\n\
							<tr>\n\
								<td align="right"><img align="left" src=' + icon1 + ' height="20" width="20">' + '000' + i + '</td>\n\
								<td bgcolor="gray">' + ram[i] + '</td>\n\
							</tr>';
            } else
                if (i < 100) {
                    outerHTML += '\n\
							<tr>\n\
								<td align="right"><img align="left" src=' + icon1 + ' height="20" width="20">' + '00' + i + '</td>\n\
								<td bgcolor="gray">' + ram[i] + '</td>\n\
							</tr>';
                } else
                    if (i < 1000) {
                        outerHTML += '\n\
							<tr>\n\
								<td align="right"><img align="left" src=' + icon1 + ' height="20" width="20">' + '0' + i + '</td>\n\
								<td bgcolor="gray">' + ram[i] + '</td>\n\
							</tr>';
                    }
        }
    }
    document.querySelector("#elementsList").innerHTML = outerHTML;
}

function preparar(est, codigo, ini, fin, proc) {
    var des = false;
    var y = 0;
    lin = 0;
    cod = $("#text").val().split(String.fromCharCode(10));
    for (i = 0; i < codigo.length; i++)
        if (codigo[i] != "" && codigo[i].split(" ")[0][0] != "/") lin++;

    var mCod = Array(lin);
    linU += lin;
    puntS = punt + fin; //Asignacion de puntero final 

    for (i = ini; i < fin; i++) {
        if (codigo[i] != "" && codigo[i].split(" ")[0][0] != "/" && codigo[i] != undefined) {
            if (punt < ram.length) {
                if (est)
                    lPro[proc].lSwap.push(codigo[i]);
            } else {
                alert("DESBORDE DE MEMORIA");
                des = true
                break;
            }
        }
    }

    if (!des) {
        for (i = 0; i < codigo.length; i++) {
            if (codigo[i] != "" && codigo[i] != undefined && codigo[i].split(" ")[0][0] != "/") {
                mCod[y] = codigo[i].split(" ");
                y++;
            }
        }
    }
    return mCod;
}

function next() {
    if (puntS > 0) {
        puntE = 0;
        raf = 0;
        puntI = puntS;
        puntS = 0;
        files = true;
        lin = 0; //Cantidad de lineas 
        acumulador = 0;
        comVar = [];
        cadSal = "";
        cadImp = "";

    }
}

function verificar(mCod) {
    var errores = "";
    var bErr = false;
    var esp = /[-#:|<>?¿+*!))$&.,'¡"@&]/
    var raf = 0;
    lVar = "";
    lEti = "";
    comVar = [];
    eti = [];
    acumulador = 0;
    cic = false;
    oCod = "";
    oCod = $("#text").val();


    for (var i = 0; i < mCod.length; i++) {
        if (mCod[i][0] == "nueva") {
            if (!(esp.test(mCod[i][1])) && isNaN(mCod[i][1][0]) && mCod[i][1][0] != undefined && (mCod[i][1].length < 255) && (mCod[i][1] != "I" && mCod[i][1] != "C" && mCod[i][1] != "R")) {
                if (!verVar(comVar, mCod[i][1], 0)) {
                    if (mCod[i][2] == "I") {
                        if (mCod[i][3] == "" || mCod[i][3] == undefined) {
                            errores += "Se asigno 0 en linea: " + i + "\n";
                            lVar += "Tipo: " + mCod[i][2] + " Nombre: '" + mCod[i][1] + "' Valor: " + 0 + "\n";
                        } else {
                            if (parseFloat(mCod[i][3]) - Math.floor(parseInt(mCod[i][3])) != 0) { //decimal
                                bErr = true;
                                errores += "Error de dato en linea: " + i + "\n";
                            } else lVar += "Tipo: " + mCod[i][2] + " Nombre: '" + mCod[i][1] + "' Valor: " + mCod[i][3] + "\n";
                        }
                        comVar.push(mCod[i][1]);
                    } else
                        if (mCod[i][2] == "R") {
                            lVar += "Tipo: " + mCod[i][2] + " Nombre: '" + mCod[i][1] + "' Valor: " + mCod[i][3] + "\n";
                            comVar.push(mCod[i][1]);
                            if (mCod[i][3] == "" || mCod[i][3] == undefined) {
                                bErr = true;
                                errores += "Se asigno 0 en linea: " + i + "\n";
                            }
                        } else
                            if (mCod[i][2] == "C") {
                                comVar.push(mCod[i][1]);
                                if (mCod[i][3] == "" || mCod[i][3] == undefined) {
                                    errores += "Se asigno vacio en linea: " + i + "\n";
                                    lVar += "Tipo: " + mCod[i][2] + " Nombre: '" + mCod[i][1] + "' Valor: " + "-" + "\n";
                                } else
                                    if (!isNaN(mCod[i][3])) {
                                        bErr = true;
                                        errores += "Error de dato en linea: " + i + "\n";
                                    } else

                                        if (mCod[i].length > 4) {
                                            var cad = "";
                                            console.log(mCod[i]);
                                            for (var x = 3; x < mCod[i].length; x++) {
                                                cad += " " + mCod[i][x];
                                            }
                                            mCod[i][3] = cad;
                                        }
                                lVar += "Tipo: " + mCod[i][2] + " Nombre: '" + mCod[i][1] + "' Valor: '" + mCod[i][3] + "'\n";
                            } else {
                                bErr = true;
                                errores += "Tipo de dato invalido en linea: " + i + "\n";
                            }
                } else {
                    bErr = true;
                    errores += "Variable ya definida en linea: " + i + "\n";
                }
            } else {
                bErr = true;
                errores += "Nombre invalido en linea: " + i + "\n";
            }
        } else
            if (mCod[i][0] == "cargue") {
                raf++;
                if (!verVar(comVar, mCod[i][1], 0)) {
                    bErr = true;
                    errores += "Variable no definida en linea: " + i + "\n";
                }

            } else
                if (mCod[i][0] == "almacene") {
                    raf++;
                    if (!verVar(comVar, mCod[i][1], 0)) {
                        bErr = true;
                        errores += "Variable no definida en linea: " + i + "\n";
                    }

                } else
                    if (mCod[i][0] == "etiqueta") {
                        if (!(esp.test(mCod[i][1])) && isNaN(mCod[i][1][0]) && mCod[i][1][0] != undefined && (mCod[i][1].length < 255)) {
                            if (mCod[i][2] != "" && mCod[i][2] != undefined && parseInt(mCod[i][2]) <= lin) {
                                if (!verEt(eti, mCod[i][1], 0)) {
                                    lEti += mCod[i][1] + "-> Linea: " + mCod[i][2] + "\n";
                                    var arr = Array(2);
                                    arr[0] = mCod[i][1];
                                    arr[1] = mCod[i][2];
                                    eti.push(arr);
                                } else {
                                    bErr = true;
                                    errores += "Etiqueta ya definida: " + i + "\n";
                                }
                            } else {
                                bErr = true;
                                errores += "Valor invalido de etiqueta: " + i + "\n";
                            }

                        } else {
                            bErr = true;
                            errores += "Nombre invalido de etiqueta: " + i + "\n";
                        }
                    } else
                        if (mCod[i][0] == "muestre" || mCod[i][0] == "imprima") {
                            raf++;
                            if (!verVar(comVar, mCod[i][1], 0) && mCod[i][1] != "acumulador") { //se puede mejorar comprovando ademas q el encontrado sea de tipo I
                                bErr = true;
                                errores += "Variable no definida en linea: " + i + "\n";

                            }
                        } else
                            if (mCod[i][0] == "sume" || mCod[i][0] == "reste" || mCod[i][0] == "multiplique" || mCod[i][0] == "potencia" || mCod[i][0] == "divida" || mCod[i][0] == "modulo") {
                                if (!verVar(comVar, mCod[i][1], 0)) {
                                    bErr = true;
                                    errores += "Variable no definida en linea: " + i + "\n";
                                } else
                                    if (!verVar(mCod, mCod[i][1], 1) || isNaN(acumulador)) { // Si se va a operar con una letra
                                        bErr = true;
                                        errores += "Tipo de dato incorrecto en linea: " + i + "\n";
                                    }
                                raf++;
                            } else
                                if (mCod[i][0] == "concatene" || mCod[i][0] == "elimine") {
                                    raf++;
                                    if (!verVar(comVar, mCod[i][1], 0)) {
                                        bErr = true;
                                        errores += "Variable no definida en linea: " + i + "\n";
                                    } else
                                        if (verVar(mCod, mCod[i][1], 1)) { // Si se va a operar con una letra
                                            bErr = true;
                                            errores += "Tipo de dato incorrecto en linea: " + i + "\n";
                                        }
                                } else
                                    if (mCod[i][0] == "extraiga") {
                                        raf++;
                                        if (!verVar(comVar, mCod[i][1], 0)) {
                                            bErr = true;
                                            errores += "Variable no definida en linea: " + i + "\n";

                                        } else
                                            if (!verVar(mCod, mCod[i][1], 1)) { // Si se va a operar con una letra

                                                bErr = true;
                                                errores += "Tipo de dato incorrecto en linea: " + i + "\n";
                                            }

                                    } else
                                        if (mCod[i][0] == "vaya") {
                                            if (mCod[i][1] == "" || mCod[i][1] == undefined) {
                                                bErr = true;
                                                errores += "Etiqueta no definida en linea: " + i + "\n";
                                            }
                                        } else
                                            if (mCod[i][0] == "vayasi") {
                                                if (mCod[i][1] == "" || mCod[i][1] == undefined) {
                                                    bErr = true;
                                                    errores += "Primera Etiqueta no definida en linea: " + i + "\n";
                                                } else
                                                    if (mCod[i][2] == "" || mCod[i][1] == undefined) {
                                                        bErr = true;
                                                        errores += "Segunda Etiqueta no definida en linea: " + i + "\n";
                                                    }
                                            } else
                                                if (mCod[i][0] == "lea") {
                                                    raf++;
                                                    if (!verVar(comVar, mCod[i][1], 0)) {
                                                        bErr = true;
                                                        errores += "Variable no definida en linea: " + i + "\n";
                                                    }
                                                } else {
                                                    if (mCod[i][0] == "retorne")
                                                        break;
                                                    if (mCod[i][0][0] != "/") {
                                                        bErr = true;
                                                        errores += "Error de comando en linea: " + i + "\n";
                                                    }
                                                }
        if (i == lin - 1) {
            if (mCod[i][0] != "retorne") {
                bErr = true;
                errores += "Falta retorno\n";
            }
        }
    }
    if (bErr) {
        $("#err").css({ 'color': 'red' });
        $("#err").css({ 'border-color': 'red' });
        $("#err").val(errores);
        $("#err").addClass('animated shake');
        text();
    } else {
        nomP++;
        $("#err").removeClass('animated shake');
        $("#err").addClass('animated infinite bounce');
        $("#var").val("");
        $("#eti").val("");
        $("#var").val(lVar);
        $("#eti").val(lEti);
        $("#err").css({ 'color': '#47FF00' });
        $("#err").css({ 'border-color': '#47FF00' });
        $("#err").val("Sintaxis correcta!\nProceso " + nomP + " Cargado exitosamente");
        $(".com	").removeAttr("disabled");
        $(".pas	").removeAttr("disabled");
        verTab(ram, true);

        var proceso;
        if (nomP > 1) proceso = new Proceso(nomP, raf, (tiempo + lin) / 4, cod, mCod); //Rafaga todas las lineas
        else proceso = new Proceso(nomP, raf, 0, cod, mCod); //Rafaga todas las lineas

        proceso.lVar = lVar;
        proceso.lEti = lEti;
        proceso.mVar = comVar; //Matris de variables
        proceso.mEti = eti; //Matris de etiquetas

        lPro.push(proceso);



        tiempo = lin;

        console.log(lPro);

    }
    return bErr;
}

function compilar(mCod, ps, ini, fin, proc) {
    var sCad = ""
    cadSal = "";
    cadImp = "";
    oCod = "";
    cic = false;
    puntE = ini + fin; //hasta donde llega la ejecucion del programa
    console.log(ini, fin);
    for (var i = ini; i < ini + fin; i++) {


        if (mCod[i][0] == "retorne") {
            //ram[puntS]="-"+"Acumulador= "+acumulador;
            lPro[proc].lSwap.push("-Acumulador= " + acumulador);
            puntS++;
        }

        if (mCod[i][0] == "nueva") {
            if (!cic) {
                if (mCod[i][3] == "" || mCod[i][3] == undefined) {

                    if (mCod[i][2] == "I" || mCod[i][2] == "R") {
                        //ram[puntS]="-"+mCod[i][1]+"->"+0;
                        lPro[proc].lSwap.push("-" + mCod[i][1] + "->" + 0);
                        mCod[i][3] = 0;
                        puntS++;
                    } else
                        if (mCod[i][2] == "C") {
                            //ram[puntS]="-"+mCod[i][1]+"->"+"( )";
                            lPro[proc].lSwap.push("-" + mCod[i][1] + "->" + "( )");
                            mCod[i][3] = "( )";
                            puntS++;
                        }
                } else {

                    if (mCod[i].length > 4) {
                        var cad = "";
                        for (var x = 3; x < mCod[i].length; x++) {
                            if (x != 3) cad += " " + mCod[i][x];
                            else cad += mCod[i][x];
                        }
                        mCod[i][3] = cad;
                    }
                    console.log(mCod[i]);
                    //ram[puntS]="-"+mCod[i][1]+"->"+mCod[i][3];
                    lPro[proc].lSwap.push("-" + mCod[i][1] + "->" + mCod[i][3]);
                    puntS++;
                }
            }

        } else
            if (mCod[i][0] == "cargue") {
                for (j in mCod) {
                    if (mCod[j][1] == mCod[i][1]) {
                        if (mCod[j][2] == "I") {
                            acumulador = parseInt(mCod[j][3]);
                            break;
                        } else
                            if (mCod[j][2] == "R") {
                                acumulador = parseFloat(mCod[j][3]);
                                break;
                            } else
                                if (mCod[j][2] == "C") {
                                    acumulador = mCod[j][3];
                                    break;
                                }
                    }
                }

            } else
                if (mCod[i][0] == "almacene") {
                    for (j in mCod) {
                        if (mCod[j][1] == mCod[i][1]) {
                            if (!isNaN(acumulador)) {
                                if (mCod[j][2] == "I") {
                                    mCod[j][3] = parseInt(acumulador);
                                    //ram[parseInt(j)+punt]="-"+mCod[j][1]+"->"+parseInt(acumulador);
                                    lPro[proc].lSwap.push("-" + mCod[j][1] + "->" + parseInt(acumulador));
                                } else {
                                    if (mCod[j][2] == "R") {
                                        mCod[j][3] = parseFloat(acumulador);
                                        //ram[parseInt(j)+punt]="-"+mCod[j][1]+"->"+parseFloat(acumulador);
                                        lPro[proc].lSwap.push("-" + mCod[j][1] + "->" + parseFloat(acumulador));
                                    }
                                }
                            } else {
                                if (mCod[j][2] == "C") {
                                    mCod[j][3] = acumulador;
                                    //ram[parseInt(j)+punt]="-"+mCod[j][1]+"->"+acumulador;
                                    lPro[proc].lSwap.push("-" + mCod[j][1] + "->" + acumulador);
                                } else alert("Error de tipo de dato");
                            }

                            break;
                        }
                    }

                } else
                    if (mCod[i][0] == "etiqueta") {
                        if (!cic) {
                            //ram[puntS]="-"+mCod[i][1]+"->"+mCod[i][2];
                            lPro[proc].lSwap.push("-" + mCod[i][1] + "->" + mCod[i][2]);
                            puntS++;
                        }
                    } else
                        if (mCod[i][0] == "vaya") {
                            cic = true;
                            for (var x = 0; x < eti.length; x++) {
                                if (eti[x][0] == mCod[i][1]) {
                                    if (parseInt(eti[x][1]) > i) i = parseInt(eti[x][1] - parseInt(cod.length - lin) + 1);
                                }
                            }
                        } else
                            if (mCod[i][0] == "vayasi") {
                                cic = true;
                                if (acumulador > 0) {
                                    for (var x = 0; x < eti.length; x++) {
                                        if (eti[x][0] == mCod[i][1]) {
                                            i = parseInt(eti[x][1] - parseInt(cod.length - lin) + 1);
                                            break;
                                        }
                                    }
                                } else
                                    if (acumulador < 0) {
                                        for (var x = 0; x < eti.length; x++) {
                                            if (eti[x][0] == mCod[i][2]) {
                                                i = parseInt(eti[x][1] - parseInt(cod.length - lin) + 1);
                                                break;
                                            }
                                        }
                                    }
                            } else
                                if (mCod[i][0] == "muestre") {

                                    if (mCod[i][1] == "acumulador") {
                                        cadSal += acumulador + "\n";
                                    } else {
                                        for (j in mCod) {
                                            if (mCod[j][1] == mCod[i][1]) {
                                                cadSal += mCod[j][3] + "\n";
                                                break;
                                            }
                                        }
                                    }
                                    $("#resul").val(cadSal);
                                } else
                                    if (mCod[i][0] == "imprima") {

                                        if (mCod[i][1] == "acumulador") {
                                            cadImp += acumulador + "\n";
                                        } else {
                                            for (j in mCod) {
                                                if (mCod[j][1] == mCod[i][1]) {
                                                    cadImp += mCod[j][3] + "\n";
                                                    break;
                                                }
                                            }
                                        }
                                        $("#imp").val(cadImp);

                                    } else
                                        if (mCod[i][0] == "sume") {
                                            for (j in mCod) {
                                                if (!isNaN(acumulador)) {
                                                    if (mCod[j][1] == mCod[i][1]) {
                                                        acumulador += parseFloat(mCod[j][3]);
                                                        break;
                                                    }
                                                } else {
                                                    alert("Error en tipo de dato");
                                                    break;
                                                }
                                            }
                                        } else
                                            if (mCod[i][0] == "reste") {
                                                for (j in mCod) {
                                                    if (!isNaN(acumulador)) {
                                                        if (mCod[j][1] == mCod[i][1]) {
                                                            acumulador -= parseFloat(mCod[j][3]);
                                                            break;
                                                        }
                                                    } else {
                                                        alert("Error en tipo de dato");
                                                        break;
                                                    }
                                                }
                                            } else
                                                if (mCod[i][0] == "multiplique") {
                                                    for (j in mCod) {
                                                        if (!isNaN(acumulador)) {
                                                            if (mCod[j][1] == mCod[i][1]) {
                                                                acumulador *= parseFloat(mCod[j][3]);
                                                                break;
                                                            }
                                                        } else {
                                                            alert("Error en tipo de dato");
                                                            break;
                                                        }
                                                    }
                                                } else
                                                    if (mCod[i][0] == "potencia") {
                                                        for (j in mCod) {
                                                            if (!isNaN(acumulador)) {
                                                                if (mCod[j][1] == mCod[i][1]) {
                                                                    acumulador = Math.pow(acumulador, parseInt(mCod[j][3]));
                                                                    break;
                                                                }
                                                            } else {
                                                                alert("Error en tipo de dato");
                                                                break;
                                                            }
                                                        }
                                                    } else
                                                        if (mCod[i][0] == "divida") {
                                                            for (j in mCod) {
                                                                if (!isNaN(acumulador)) {
                                                                    if (mCod[j][1] == mCod[i][1]) {
                                                                        if (mCod[j][3] != "0")
                                                                            acumulador /= parseFloat(mCod[j][3]);
                                                                        else alert("División por cero detectada!");
                                                                        break;
                                                                    }
                                                                } else {
                                                                    alert("Error en tipo de dato");
                                                                    break;
                                                                }
                                                            }
                                                        } else
                                                            if (mCod[i][0] == "modulo") {
                                                                for (j in mCod) {
                                                                    if (!isNaN(acumulador)) {
                                                                        if (mCod[j][1] == mCod[i][1]) {
                                                                            acumulador = acumulador % parseInt(mCod[j][3]);
                                                                            break;
                                                                        }
                                                                    } else {
                                                                        alert("Error en tipo de dato");
                                                                        break;
                                                                    }
                                                                }
                                                            } else
                                                                if (mCod[i][0] == "lea") {
                                                                    var dat;
                                                                    for (j in mCod) {
                                                                        if (mCod[j][1] == mCod[i][1]) {
                                                                            if (mCod[j][2] == "I") {
                                                                                do {
                                                                                    dat = prompt("Ingrese dato entero");
                                                                                    mCod[j][3] = parseInt(dat);
                                                                                    //ram[parseInt(j)+punt]="-"+mCod[j][1]+"->"+parseInt(dat);
                                                                                    lPro[proc].lSwap.push("-" + mCod[j][1] + "->" + parseInt(dat));
                                                                                } while (isNaN(dat) || parseFloat(dat) - Math.floor(dat) != 0)
                                                                            } else
                                                                                if (mCod[j][2] == "R") {
                                                                                    do {
                                                                                        dat = prompt("Ingrese dato real");
                                                                                        mCod[j][3] = parseFloat(dat);
                                                                                        //ram[parseInt(j)+punt]="-"+mCod[j][1]+"->"+parseFloat(dat);
                                                                                        lPro[proc].lSwap.push("-" + mCod[j][1] + "->" + parseFloat(dat));
                                                                                    } while (isNaN(dat))
                                                                                } else
                                                                                    if (mCod[j][2] == "C") {
                                                                                        do {
                                                                                            dat = prompt("Ingrese Texto");
                                                                                            mCod[j][3] = dat;
                                                                                            //ram[parseInt(j)+punt]="-"+mCod[j][1]+"->"+dat;
                                                                                            lPro[proc].lSwap.push("-" + mCod[j][1] + "->" + dat);
                                                                                        } while (!isNaN(dat))
                                                                                    }
                                                                            break;
                                                                        }
                                                                    }
                                                                } else
                                                                    if (mCod[i][0] == "concatene") {
                                                                        for (j in mCod) {
                                                                            if (isNaN(acumulador)) {
                                                                                if (mCod[j][1] == mCod[i][1]) {
                                                                                    acumulador += mCod[j][3];
                                                                                    break;
                                                                                }
                                                                            } else {
                                                                                alert("Error en tipo de dato");
                                                                                break;
                                                                            }
                                                                        }
                                                                    } else
                                                                        if (mCod[i][0] == "elimine") {
                                                                            sCad = "";
                                                                            for (j in mCod) {
                                                                                if (isNaN(acumulador)) {
                                                                                    if (mCod[j][1] == mCod[i][1]) {
                                                                                        for (var x = 0; x < acumulador.length; x++) {
                                                                                            if (acumulador[x] != mCod[j][3]) sCad += acumulador[x];
                                                                                        }
                                                                                        acumulador = sCad;
                                                                                        break;
                                                                                    }
                                                                                } else {
                                                                                    alert("Error en tipo de dato");
                                                                                    break;
                                                                                }
                                                                            }
                                                                        } else
                                                                            if (mCod[i][0] == "extraiga") {
                                                                                sCad = "";
                                                                                for (j in mCod) {
                                                                                    if (isNaN(acumulador)) {
                                                                                        if (mCod[j][1] == mCod[i][1]) {
                                                                                            for (var x = 0; x < parseInt(mCod[j][3]); x++) {
                                                                                                if (x < acumulador.length) sCad += acumulador[x];
                                                                                            }
                                                                                            acumulador = sCad;
                                                                                            break;
                                                                                        }
                                                                                    } else {
                                                                                        alert("Error en tipo de dato");
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
        if (ps) {
            var linea = "";
            for (j in mCod[i]) {
                linea += mCod[i][j] + " ";
            }
            alert("Instrucción: " + linea + "\nValor de acumulador: " + acumulador);
            console.log("Instrucción: " + linea + "\nValor de acumulador: " + acumulador);
            linea = "";
        }
    }
    
    verTab(ram, false);
}


function verVar(comVar, vari, tip) {
    var est = false;
    if (tip == 0) {
        if (comVar.length > 0) {
            for (i = 0; i < comVar.length; i++) {
                if (comVar[i] == vari) {
                    est = true;
                    break;
                }
            }
        }
    } else
        if (tip == 1) {
            for (i = 0; i < comVar.length; i++) {
                if (comVar[i][1] == vari && (comVar[i][2] == "I" || comVar[i][2] == "R")) {
                    est = true;
                    break;
                }
            }
        }
    return est;
}

function verEt(comEt, eti, tip) {
    var est = false;
    if (comEt.length > 0)
        for (i = 0; i < comEt.length; i++)
            if (comEt[i][0] == eti) {
                est = true;
                break;
            }
    return est;
}

function Efecto(procesos, nombre) {
    var salida = "";
    salida += "Efecto de planificación " + nombre + ":\n";
    for (var i = 0; i < procesos.length; i++)
        salida += "P" + procesos[i][0] + " con " + procesos[i][2] + " de rafaga\n"
    return salida;
}

//Algoritmo de planificacion
function FCFS(arrPro) {
    var mPro = new Array(0); //Matriz con los datos de los procesos
    var cand = [0, 0, 0]; //Arreglo candidato como elemento de la matriz resultante
    var mSec = new Array(0); //Matriz resultante con los procesos ordenador con el argoritmo
    var dMen = [0, 0, 100];
    var indMen = 0;

    for (var i = 0; i < arrPro.length; i++) //organizacion de Procesos por orden de llegada
        mPro.push([arrPro[i].nombre, arrPro[i].ti, arrPro[i].raf]);

    return mPro;
}


function aMemV(list, ini, nom) {
    var ind = 0;
    var salida = "Uso de partición para Proceso " + nom + "\n";;
    for (i = ini; i < ram.length; i++) {
        if (ind < list.length)
            ram[i] = list[ind];
        else break;
        ind++;
        punt++;
    }
    salida += "Inicio en: " + ini + "\nLimite en: " + parseInt(ini + list.length);
    return salida;
}


function FCFS(arrPro) {
    var mPro = new Array(0); //Matriz con los datos de los procesos
    var cand = [0, 0, 0]; //Arreglo candidato como elemento de la matriz resultante
    var mSec = new Array(0); //Matriz resultante con los procesos ordenador con el argoritmo
    var dMen = [0, 0, 100];
    var indMen = 0;

    for (var i = 0; i < arrPro.length; i++) //organizacion de Procesos por orden de llegada
        mPro.push([arrPro[i].nombre, arrPro[i].ti, arrPro[i].raf]);

    return mPro;
}

function SJF(arrPro) {
    var mPro = new Array(0); //Matriz con los datos de los procesos
    var cand = [0, 0, 0]; //Arreglo candidato como elemento de la matriz resultante
    var mSec = new Array(0); //Matriz resultante con los procesos ordenador con el argoritmo
    var dMen = [0, 0, 100];
    var indMen = 0;

    for (var i = 0; i < arrPro.length; i++)
        mPro.push([arrPro[i].nombre, arrPro[i].ti, arrPro[i].raf]);

    var size = mPro.length;

    for (var i = 0; i < size; i++) {
        cand = [0, 0, 0];
        indMen = 0;
        dMen = [0, 0, 100];

        if (i == 0) dMen = mPro[i];
        else {
            for (var j = 0; j < mPro.length; j++) { //iterar en procesos
                if (mPro[j][2] < dMen[2]) {
                    dMen = mPro[j];
                    indMen = j;
                    if (j < 0) dMen[1] = mPro[j - 1][1];
                }
            }
        }
        mSec.push(dMen);
        mPro.splice(indMen, 1);
        indMen = 0;
    }
    return mSec;
}

function RR(arrPro, q) {
    var mPro = new Array(0); //Matriz con los datos de los procesos
    var cand = [0, 0, 0]; //Arreglo candidato como elemento de la matriz resultante
    var mSec = new Array(0); //Matriz resultante con los procesos ordenador con el argoritmo
    var quan = q;

    for (var i = 0; i < arrPro.length; i++)
        mPro.push([arrPro[i].nombre, arrPro[i].ti, arrPro[i].raf]);

    for (var i = 0; i < mPro.length; i++) {
        cand = [0, 0, 0];
        console.log(mPro[i][2]);
        if (mPro[i][2] > 0 && mPro[i][2] <= quan) quan = mPro[i][2];
        else quan = q;
        //console.log(mPro[i][2]);
        if (mPro[i][2] > 0) {
            mPro[i][2] -= quan;
            cand[0] = mPro[i][0];
            cand[1] = i;
            cand[2] += parseInt(quan);

        } else mPro.splice(i, 1);

        if (cand[0] != 0) mSec.push(cand);
        if (mPro.length == 0) break;
        if (i == mPro.length - 1) i = -1;

    }

    return mSec;
}

function SRTN(arrPro) {
    var mPro = new Array(0); //Matriz con los datos de los procesos
    var cand = [0, 0, 0]; //Arreglo candidato como elemento de la matriz resultante
    var candE = [0, 0, 0];
    var mSec = new Array(0); //Matriz resultante con los procesos ordenador con el argoritmo
    var igual = false; //estado de tiempo de llegada
    var dMen = [0, 0, 100];
    var indMen = 0;
    var tPos = 0;

    for (var i = 0; i < arrPro.length; i++)
        mPro.push([arrPro[i].nombre, arrPro[i].ti, arrPro[i].raf]);

    for (var i = 0; i < mPro.length; i++) {
        igual = false;
        cand = [0, 0, 0];
        indMen = 0;
        dMen = [0, 0, 100];

        for (var j = 0; j < mPro.length; j++) { //iterar en procesos
            if (mPro[j][2] < dMen[2]) {
                dMen = mPro[j];
                indMen = j;
            }
        }
        if (dMen[1] == -1) { //Si hay menor expropiado
            mSec.push(dMen);
            mPro.splice(indMen, 1);
            indMen = 0;
        }

        for (var j = i + 1; j < mPro.length; j++) { //Proceso a expropiar
            if (mPro[j][1] != -1 && mPro[j][1] < tPos + mPro[i][2]) {
                cand[2] = mPro[i][2] - ((mPro[j][1] - mPro[i][1]));
                cand[0] = mPro[i][0];
                cand[1] = tPos;
                candE = [cand[0], -1, mPro[j][1] - mPro[i][1]];
                igual = true;
                tPos = mPro[j][1];
                mSec.push(cand);
                break;
            }
        }
        if (igual == false) { //Proceso completado
            cand[2] = mPro[i][2];
            cand[0] = mPro[i][0];
            cand[1] = tPos;
            tPos = cand[2];
            mSec.push(cand);
        }

        if (candE[0] != 0) { //Porcion expropiada
            mPro.push(candE);
            candE = [0, 0, 0];
        }
    }
    return mSec;
}