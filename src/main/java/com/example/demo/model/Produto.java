package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Informações principais
    private String nome;
    @Column(length = 1000)
    private String descricao;
    private String categoria;
    private String subcategoria;
    private String marca;
    private String sku;
    private String plataforma;

    // Valores
    private Double precoCusto;
    private Double preco;       // preço de venda
    private Double desconto;    // em %

    // Estoque
    private Integer quantidade;
    private Integer estoqueMinimo;
    private Boolean ativo;
    private Boolean freteGratis;

    // Imagem
    private String imagemUrl;
    private String imagemAlt;

    // Informações adicionais
    private Double peso;
    private Double altura;
    private Double largura;
    private Double comprimento;
    private String unidadeMedida;
    private String codigoBarras;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getSubcategoria() { return subcategoria; }
    public void setSubcategoria(String subcategoria) { this.subcategoria = subcategoria; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }

    public Double getPrecoCusto() { return precoCusto; }
    public void setPrecoCusto(Double precoCusto) { this.precoCusto = precoCusto; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }

    public Double getDesconto() { return desconto; }
    public void setDesconto(Double desconto) { this.desconto = desconto; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public Integer getEstoqueMinimo() { return estoqueMinimo; }
    public void setEstoqueMinimo(Integer estoqueMinimo) { this.estoqueMinimo = estoqueMinimo; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Boolean getFreteGratis() { return freteGratis; }
    public void setFreteGratis(Boolean freteGratis) { this.freteGratis = freteGratis; }

    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public String getImagemAlt() { return imagemAlt; }
    public void setImagemAlt(String imagemAlt) { this.imagemAlt = imagemAlt; }

    public Double getPeso() { return peso; }
    public void setPeso(Double peso) { this.peso = peso; }

    public Double getAltura() { return altura; }
    public void setAltura(Double altura) { this.altura = altura; }

    public Double getLargura() { return largura; }
    public void setLargura(Double largura) { this.largura = largura; }

    public Double getComprimento() { return comprimento; }
    public void setComprimento(Double comprimento) { this.comprimento = comprimento; }

    public String getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }
}
