

angular.module('todoApp', [])
  .controller('mochilaController', function() {

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
      { id : 13, value : 5, weight :8}

    ];

    vm.mochilas = [];
    vm.mochilasValues = [];
    vm.melhores = [];

    vm.numeroMochilas = 100;

    vm.maxWeigth = 30;

    vm.melhor = {
      total : 0
    }

  // PEGA O VALOR DA MOCHILA 
     vm.getValue = function ( mochila ) {

       var total = 0;
       var weight = 0;
       angular.forEach( mochila.itens, function(value, key) {
          if (value) {
            total +=  vm.objetos[key].value;
            weight += vm.objetos[key].weight; 

          }
       });

       mochila.total = total;
       mochila.totalWeigth = weight;
       
       if (weight > vm.maxWeigth){
        mochila.fitness = 0;
       } else {
         mochila.fitness = total + (total / weight / 2) ; 
       }
       
       return mochila;

     }
    
    // CRIA OS INDIVIDUOS 
    for (var m = 0; m < vm.numeroMochilas; m++) {

        var array = [];
        for (var i = 0 ; i < vm.objetos.length; i++) {
          
            array[i] = Math.floor(Math.random() * 10) % 2;
          
        }

        var mochila = {
          itens : array
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
          if (vm.mochilas[i].totalWeigth <= vm.maxWeigth){

            if( vm.melhor.total < vm.mochilas[i].total){

              vm.melhor = vm.mochilas[i];
          
              vm.contador = 0;

              break;  

            } else {
               vm.contador += 1;
            }
            
          }
        } 
    } 
     
    vm.cruza = function(mochila){

      var pai = vm.mochilas[0];

      var filho1 = {
        itens : []
      };
      var filho2 = {
        itens : []
      };
      var pontoDeDivisao = Math.floor(Math.random() * (vm.objetos.length - 1) );

      for (var i = 0; i < vm.objetos.length; i++) {
        if ( i < pontoDeDivisao) {
          filho1.itens.push( pai.itens[i] );
          filho2.itens.push( mochila.itens[i]);
        } else {
          filho2.itens.push( pai.itens[i] );
          filho1.itens.push( mochila.itens[i]);
        }  
      }

      return [ vm.getValue(filho1) , vm.getValue( filho2) ];
    } 

    vm.reproduzir = function (){

      vm.mochilasCopy = angular.copy(vm.mochilas);

      for (var i = vm.mochilasCopy.length - 1; i > 0; i--) {

        var filhos = vm.cruza(  vm.mochilasCopy[i]);
        vm.mochilas.push ( filhos[0] );
        vm.mochilas.push ( filhos[1] );
      }

    }

    vm.getMelhor();

    vm.melhores.push( vm.mochilas[0] );
    
    vm.contador = 1;
    vm.break = 0;

//    for (var i = 0; i < 200; i++) {
    while(true){ 

          vm.reproduzir();
          vm.mochilas = shellSort( vm.mochilas );
          vm.mochilas.splice( vm.numeroMochilas, vm.mochilas.length);
          vm.getMelhor();

          vm.melhores.push( vm.mochilas[0] );

          vm.break += 1; 
          
          if (vm.contador > 20){

            break;
          
          }
    }

});