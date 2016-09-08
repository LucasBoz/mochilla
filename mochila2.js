

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
       
       if (mochila.weight > 30 || mochila.weight == 0) {
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
     
    vm.cruzaOX = function(mochila){

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

        //                                                           SE COLOCAR "-2" DA certo  
        pontoDeDivisao1 =  Math.floor(Math.random() * ( vm.objetos.length - 2)) + 2;
        pontoDeDivisao2 =  Math.floor(Math.random() * ( vm.objetos.length - 2)) + 2;

      }

      if(pontoDeDivisao1 > pontoDeDivisao2){
        var aux = pontoDeDivisao1;
        pontoDeDivisao1 = pontoDeDivisao2;
        pontoDeDivisao2 = aux;
      }


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

      pai1 = {
        itens : pai1
      }

      pai2 = {
        itens : pai2
      }
  
      return [ vm.getValue(pai1) , vm.getValue( pai2 ) ];

    } 

    vm.cruzaCX = function( mochila ){
      var pai1 = vm.mochilas[0].itens;
      var pai2 = mochila.itens;

      var repetiu = false;

      var toSearch = null;

      filho = new Array( pai1.length );

      while ( !repetiu ){
        if (!toSearch) {
          filho[0] = pai1[0];
          toSearch = pai2[0];
        }else{

          for (var i = 0; i < pai1.length ; i++) {
            if (toSearch.id == pai1[i].id) {
              filho[i] = toSearch;
              pos = buscarNoFilho( pai2[i], filho );
              if ( pos > -1 ) { // foi encontrado
                repetiu = true;
              } else {
                toSearch = pai2[i];
              }

                //Verificamos se o pai 2 na posicao i não está no filho, se não estiver, o toSearch recebe o pai2 na posicao i, e segue o flux
                // Se estiver, repetou = true, vai quebrar o while, e a gente preenche os espaços VaZIOS de filho1, com a mesma posicao ado pai 2
            }
          }
        }

        //Prencher as posições vazias com o pai2
        for( var k = 0; k < filho.length; k++ )
        {
          if ( !filho[k] ) {
            filho[k] = pai2[k];
          }
        }

      }

      filho = {
        itens : filho
      }


  
      return [ vm.getValue(filho) , vm.getValue( filho ) ];

    }

    function buscarNoFilho( item, itens )
    { 
      var found = false;
      for ( var k = 0; k < itens.length; k++ ) {
        if ( itens[k] && itens[k].id == item.id ) {
          found = true;
          return k;
        }
      } 
      if ( !found ) {
        return -1;  
      }
    }

    vm.isBom = function ( filho ) {
      if (filho.weight < 30 && filho.fitness != 0 && filho.weight == 0){

            console.log("Adicionouuu");

            return true;
      }
      return false;
    }

    vm.reproduzir = function (){

      vm.mochilasCopy = angular.copy(vm.mochilas);

      for (var i = vm.mochilasCopy.length - 1; i > 0; i--) {    

        var filhos = vm.cruzaCX(  vm.mochilasCopy[i]);

        if( vm.isBom( filhos[0] ) && (filhos[0] != filhos[1]) ){
          
          vm.mochilas.push ( filhos[0] );
        
        }
        if ( vm.isBom(filhos[1]) ){
          vm.mochilas.push ( filhos[1] );
        }
      }

    }

    vm.tiraIguais = function( mochilas) {

      tamanho = mochilas.length;

      for (var i = tamanho - 1; i >= 10; i--) {
    
        if( mochilas[i].fitness == mochilas[i - 1].fitness || mochila.fitness == 0 ){
           
           mochilas.splice ( i , 1 );
           vm.tiraIguais =+ 1;

           console.log("Capou fora " + vm.tiraIguais);
            
           i--;

        }
    
      }
      return mochilas;
    }

    vm.contadorTiraIguais = 0;

    vm.melhor = vm.mochilas[0];

    vm.getMelhor();

    vm.antigoMelhor = vm.melhor;

    vm.melhores.push( vm.mochilas[0] );
    
    vm.contador = 1;

    vm.break = 0;

    while( vm.contador < 10 ){ 

          vm.reproduzir();
          
          vm.mochilas = shellSort( vm.mochilas );

          vm.mochilas.splice( vm.numeroMochilas, vm.mochilas.length);

          
          vm.getMelhor();

          if( vm.antigoMelhor.fitness < vm.melhor.fitness || vm.melhores.weight > vm.maxWeigth ){
            vm.contador = 0;
          }else {
            vm.contador += 1;
          }

          vm.antigoMelhor = vm.melhor;

          vm.melhores.push( vm.mochilas[0] );

          vm.break += 1; 
          
          console.log( vm.break + " - " + vm.contador);

    }

});