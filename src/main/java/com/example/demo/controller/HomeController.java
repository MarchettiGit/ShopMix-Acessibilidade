package com.example.demo.controller;

import com.example.demo.model.Produto;
import com.example.demo.service.ProdutoService;
import com.example.demo.service.PedidoService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Controller
public class HomeController {

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/home")
    public String homePage(Model model) {

        model.addAttribute("produtos", produtoService.listar());
        model.addAttribute("anuncios", produtoService.listar());

        // 🔥 ISSO AQUI ESTAVA FALTANDO
        model.addAttribute("pedidos", pedidoService.listarTodos());

        return "home";
    }

    @GetMapping("/anunciar")
    public String paginaAnuncio() {
        return "anunciar";
    }

    @PostMapping("/anunciar")
    public String salvarProduto(@RequestParam("imagemFile") MultipartFile file,
                                Produto produto) {

        try {
            if (!file.isEmpty()) {

                String nomeArquivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();

                // caminho REAL do projeto rodando
                String caminho = new File("src/main/resources/static/uploads/").getAbsolutePath();

                File pasta = new File(caminho);
                if (!pasta.exists()) {
                    pasta.mkdirs();
                }

                File destino = new File(pasta, nomeArquivo);
                file.transferTo(destino);

                // caminho que o navegador usa
                produto.setImagemUrl("/uploads/" + nomeArquivo);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        produtoService.salvar(produto);

        return "redirect:/home";
    }

    @GetMapping("/anuncio/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {
        model.addAttribute("anuncio", produtoService.buscarPorId(id));
        return "editar-anuncio";
    }

    @PostMapping("/anuncio/editar")
    public String atualizar(Produto produto) {
        produtoService.salvar(produto);
        return "redirect:/home";
    }

    @PostMapping("/anuncio/delete/{id}")
    public String deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return "redirect:/home";
    }

    @GetMapping("/export/pdf")
    public void exportarPdf(HttpServletResponse response) throws Exception {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("RELATÓRIO DE PEDIDOS"));
        document.add(new Paragraph(" "));

        for (var pedido : pedidoService.listarTodos()) {
            document.add(new Paragraph(
                    "Pedido #" + pedido.getId() +
                            " | Cliente: " + pedido.getClienteNome() +
                            " | Total: R$ " + pedido.getTotal()
            ));
        }

        document.close();
    }


}