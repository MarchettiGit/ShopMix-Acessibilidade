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
})()
