

angular.module('todoApp', [])
  .controller('mochilaController2', function($filter) {

    var vm = this;

  // INIT
    vm.objetos = [

      { id : 1,  value : 3, weight :4},
      { id : 2,  value : 5, weight :2},
      { id : 3,  value : 8, weight :1},
      { id : 4,  value : 2, weight :5},
      { id : 5,  value : 7, weight :6},
      { id : 6,  value : 3, weight :1},
      { id : 7,  value : 5, weight :3},
      { id : 8,  value : 6, weight :2},
      { id : 9,  value : 5, weight :4},
      { id : 10, value : 8, weight :1},
      { id : 11, value : 4, weight :5},
      { id : 12, value : 9, weight :3},
      { id : 13, value : 3, weight :9},
      { id : 14, value : 5, weight :8}

    ];




    vm.mochilas = [];
    vm.mochilasValues = [];
    vm.melhores = [];

    vm.numeroMochilas = 100;

    vm.maxWeigth = 30;

    vm.melhor = {
      total : 0,
      fitness : 0
    }

  // PEGA O VALOR DA MOCHILA 
     vm.getValue = function ( mochila ) {

       var total = 0;
       var weight = 0;

       angular.forEach( mochila.itens, function(value, key) {
          if (value.tem) {

            total +=  vm.objetos[value.item - 1].value;
            weight += vm.objetos[value.item - 1].weight; 

          }
       });

       mochila.total = total;
       mochila.weight = weight;
       
       if (mochila.weight > 30 ) {
          mochila.fitness = 0
       } else {
          mochila.fitness = total + total / weight;
       }
       
       return mochila;

     }
    

    vm.shuffleArray = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }


    // CRIA OS INDIVIDUOS 
    for (var m = 0; m < vm.numeroMochilas; m++) {

        var array = [];

        var mochila = {};

        for (var i = 0 ; i < vm.objetos.length; i++) {
            array[i] = {
              tem : Math.floor(Math.random() * 10) % 2, 
              item : i + 1
            }
        }

        var mochila = {
          itens : vm.shuffleArray(array)
        }

        vm.getValue(mochila);

        vm.mochilas.push(mochila);

   }


  //SORT
   function shellSort (a) {
      for (var h = a.length; h = parseInt(h / 2);) {
          for (var i = h; i < a.length; i++) {
              var k = a[i];
              for (var j = i; j >= h && k.fitness > a[j - h].fitness; j -= h){
                  a[j] = a[j - h];
              }
              a[j] = k;
          }
      }
      return a;
    }

    vm.getMelhor = function(){
        for (var i = 1 ; i < vm.mochilas.length; i++) {
          if (vm.mochilas[i].weigth <= vm.maxWeigth){

            if( vm.melhor.total < vm.mochilas[i].total){

              vm.melhor = vm.mochilas[i];
          
              break;  

            } 
            
          }
        } 
    } 
     
    vm.cruza = function(mochila){

      var pai1 = angular.copy(vm.mochilas[0].itens);

      var pai2 = angular.copy(mochila.itens);

      var filho1 = {
        itens : []
      };
      var filho2 = {
        itens : []
      };

      var pontoDeDivisao1 = 0;
      var pontoDeDivisao2 = 0;

      while(pontoDeDivisao1 == pontoDeDivisao2){

        //                                                           SE COLOCAR "-2" DA ERRADO 
        pontoDeDivisao1 =  Math.floor(Math.random() * ( vm.objetos.length - 1 - 2 + 1)) + 2;
        pontoDeDivisao2 =  Math.floor(Math.random() * ( vm.objetos.length - 1 - 2 + 1)) + 2;



      }

      if(pontoDeDivisao1 > pontoDeDivisao2){
        var aux = pontoDeDivisao1;
        pontoDeDivisao1 = pontoDeDivisao2;
        pontoDeDivisao2 = aux;
      }


///TESTEEEEEEEEEEEEE  vvvvvvvvvvvvvvvvvvv

      pai1 = [ { item  : "A" }, { item  : "B"}, { item  : "C"}, { item  : "D"}, { item  : "F"}, { item  : "E"}, { item  : "G"}];

      pai2 = [ { item  : "C" }, { item  : "E"}, { item  : "G"}, { item  : "B"}, { item  : "D"}, { item  : "F"}, { item  : "A"}];

      pontoDeDivisao1 = 2;

      pontoDeDivisao2 = 5;


//TESTEEEEEEEEEEEEEEEE ^^^^^^^^^^^^^^^^^^^^    


      var meio1 = (angular.copy(pai1)).splice(pontoDeDivisao1, pontoDeDivisao2 - pontoDeDivisao1);
      var meio2 = (angular.copy(pai2)).splice(pontoDeDivisao1, pontoDeDivisao2 - pontoDeDivisao1);

      pai1ParteB = pai1;
      pai2ParteB = pai2;

      pai1ParteA = angular.copy( pai1ParteB.splice(0, pontoDeDivisao1) );

      pai2ParteA = angular.copy( pai2ParteB.splice(0, pontoDeDivisao1));

        
      for (var j = meio1.length - 1; j >= 0; j--) {
      
        //PAI 1
        var asd = pai1ParteA.map(function(e) { return e.item; }).indexOf( meio2[j].item );

        if (asd > -1){
            pai1ParteA.splice ( asd , 1 );
        } 
        
        asd =  pai1ParteB.map(function(e) { return e.item; }).indexOf( meio2[j].item );
        if (asd > -1){
             pai1ParteB.splice (asd  , 1 ); 
        }
       
        //PAI 2

         asd =   pai2ParteA.map(function(e) { return e.item; }).indexOf( meio1[j].item ) ;
        if (asd > -1){
            pai2ParteA.splice (asd , 1 );
        }
       
        asd =  pai2ParteB.map(function(e) { return e.item; }).indexOf( meio1[j].item );
        if (asd > -1){
            pai2ParteB.splice ( asd , 1 );
        }
       
      }

      pai1 = pai1ParteB.concat(  pai1ParteA );


      pai2 = pai2ParteB.concat(  pai2ParteA );


      for (var i = 0 ; i < meio1.length; i++) {

        pai1.splice(i + pontoDeDivisao1, 0, meio2[i]);
        pai2.splice(i + pontoDeDivisao1, 0, meio1[i]);

      }


  
      return [ vm.getValue(pai1) , vm.getValue( pai2 ) ];

    } 

    vm.reproduzir = function (){

      vm.mochilasCopy = angular.copy(vm.mochilas);

      for (var i = vm.mochilasCopy.length - 1; i > 0; i--) {

        var filhos = vm.cruza(  vm.mochilasCopy[i]);
        vm.mochilas.push ( filhos[0] );
        vm.mochilas.push ( filhos[1] );
      }

    }

    vm.melhor = vm.mochilas[0];

    vm.getMelhor();

    vm.melhores.push( vm.mochilas[0] );
    
    vm.contador = 1;

    vm.break = 0;

    while( vm.contador < 5 ){ 

          vm.reproduzir();
          vm.mochilas = shellSort( vm.mochilas );
          vm.mochilas.splice( vm.numeroMochilas, vm.mochilas.length);
          vm.getMelhor();

          vm.melhores.push( vm.mochilas[0] );

          vm.break += 1; 
  vm.contador += 1;
          if ( true || vm.mochilas[0].fitness == vm.melhor.fitness ){

           
             
          } else {

              console.log("false = " + vm.mochilas[0].fitness  + " = " + vm.melhor.fitness );
              vm.contador = 0;
          }




          console.log( vm.break + " - " + vm.contador);

    }

});