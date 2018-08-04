'use strict';
var app = angular.module('App', []); 

app.controller('Ctrl', function Ctrl($q, $timeout) {
  var vm = this;

  var data = {
    name: 'Item 1',
    children: [
      {
        name: 'Item 2',
        loaded: true,
        children: [
          {
            name: 'Item 2a',
            loaded: true,
            children: [
              {name: 'Item 2a-1'},
              {name: 'Item 2a-2'},
              {name: 'Item 2a-3'},
            ]
          },
          {name: 'Item 2b'},
          {name: 'Item 2c'}
        ]
      },
      {
        name: 'Item 3',
        loaded: true,
        children: [
          {name: 'Item 3a'},
          {name: 'Item 3b'},
          {name: 'Item cc'}
        ]
      },
      {
        name: 'Item 4',
        loaded: true,
        children: [
          {
            name: 'Item 4a',
            loaded: true,
            children: [
              {name: 'Item 4a-1'},
              {name: 'Item 4a-2'},
              {name: 'Item 4a-3'},
            ]
          },
          {name: 'Item 4b'},
          {name: 'Item 4c'}
        ]
      },
      {
        name: 'Item 5',
        loaded: true,
        children: [
          {name: 'Item 5a'},
          {name: 'Item 5b'},
          {name: 'Item 5c'},
          {name: 'Item 5d'}
        ]
      }
    ]
  }

  var createGridFromRawData = function() {
    function generateGridCells(o, level, row) {
      if(o.children) {
        var selected, selectedRow;
        var startRow = Math.max(row - Math.floor(o.children.length / 2), 0);
        o.children.forEach(function(item, i) {
          result[i + startRow] = result[i + startRow] || [];
          result[i + startRow][level] = item;
          if(item.selected) {
            selected = item;
            selectedRow = i + startRow;
          }
        });
        if(selected) {
          generateGridCells(selected, level + 1, selectedRow);
        }
        maxLevel = Math.max(maxLevel, level);
      }
    }

    var result = [], maxLevel = 0;
    generateGridCells(data, 0, 0);
    // explicitly set empty cells to {}
    result.forEach(function(r) {
      for(var i = 0; i <= maxLevel; i++) {
        r[i] = r[i] || {};
      }
    });

    vm.result = result;
  };

  var resetSelections = function(cell, level) {
    vm.result.forEach(function(r) {
      r.forEach(function(c, i) {
        if(i >= level && c) {
          c.selected = c === cell; 
        }
      });
    });
  };

  var fakeAPICall = function() {
    var deferred = $q.defer();
    $timeout(function() {deferred.resolve([{name: 'Test 1'}, {name: 'Test 2'}, {name: 'Test 3'}])}, 2000);
    return deferred.promise;
  };

  var loadCellChild = function(cell) {
    if(cell.loaded === undefined) {
      cell.loaded = false;
      fakeAPICall().then(function(response) {
        cell.loaded = true;
        cell.children = response;
        createGridFromRawData();
      });  
    }
    
  };

  vm.selectCell = function(cell, level) {
    if(cell.name && !cell.selected) {
      resetSelections(cell, level);
      createGridFromRawData();
      loadCellChild(cell);
    }
  };

  createGridFromRawData();

});
