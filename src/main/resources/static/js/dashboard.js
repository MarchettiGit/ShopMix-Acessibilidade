/* globals Chart:false */

(() => {
    'use strict'

    const chartLine = document.getElementById('myChart');
    if (chartLine) {
        new Chart(chartLine, {
            type: 'line',
            data: {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
                datasets: [{
                    data: [112, 56, 89, 120, 98],
                    lineTension: 0,
                    backgroundColor: 'transparent',
                    borderColor: '#007bff',
                    borderWidth: 4,
                    pointBackgroundColor: '#007bff'
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    tooltip: { boxPadding: 3 }
                }
            }
        });
    }

    const chartPedidos = document.getElementById('chartPedidos');
    if (chartPedidos) {
        new Chart(chartPedidos, {
            type: 'bar',
            data: {
                labels: ['Shopee', 'Mercado Livre', 'Loja própria'],
                datasets: [{
                    label: 'Pedidos',
                    data: [120, 90, 60],
                    backgroundColor: ['#0d6efd', '#198754', '#ffc107']
                }]
            }
        });
    }

    const chartProdutos = document.getElementById('chartProdutos');
    if (chartProdutos) {
        new Chart(chartProdutos, {
            type: 'doughnut',
            data: {
                labels: ['Eletrônicos', 'Roupas', 'Acessórios'],
                datasets: [{
                    label: 'Produtos',
                    data: [40, 30, 20],
                    backgroundColor: ['#0d6efd', '#198754', '#6c757d']
                }]
            }
        });
    }
})()
