/* globals Chart:false */

(() => {
    'use strict'

    // Graphs
    const ctx = document.getElementById('myChart')
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio'
            ],
            datasets: [{
                data: [
                    112,
                    56,
                    89,
                    120,
                    98
                ],
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    boxPadding: 3
                }
            }
        }
    })
    new Chart(document.getElementById('chartPedidos'), {
        type: 'bar',
        data: {
            labels: ['Shopee', 'Mercado Livre', 'Site'],
            datasets: [{
                data: [120, 90, 60],
                backgroundColor: ['#0d6efd', '#198754', '#ffc107']
            }]
        }
    });

    new Chart(document.getElementById('chartProdutos'), {
        type: 'doughnut',
        data: {
            labels: ['Eletrônicos', 'Roupas', 'Acessórios'],
            datasets: [{
                data: [40, 30, 20]
            }]
        }
    });


})()
