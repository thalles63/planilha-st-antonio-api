module.exports = {
    generatePdfInfo: (dadosClientes) => {

        const dadosFormatados = dadosClientes
            .sort(function(a, b) { return new Date(a.dataEntrega) - new Date(b.dataEntrega) })
            .map((dado) => {
                return [new Date(dado.dataEntrega).toLocaleDateString('pt-BR'), dado.cliente, dado.quantidade, dado.observacao]
        })

        return {
            content: [
                { text: 'Clientes cervejaria St. Antônio', style: 'header' },
                // 'Listagem de todos os clientes com entregas pendentes, listagem emitida em: ',
                {
                    style: 'table',
                    table: {
                        headerRows: 1,
                        body: [
                            [
                                {text: 'Data de Entrega', style: 'tableHeader'}, 
                                {text: 'Cliente', style: 'tableHeader'}, 
                                {text: 'Quantidade', style: 'tableHeader'},
                                {text: 'Observação', style: 'tableHeader'}
                            ],
                            ...dadosFormatados
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                table: {
                    margin: [0, 15, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            }
        }
    }
}
