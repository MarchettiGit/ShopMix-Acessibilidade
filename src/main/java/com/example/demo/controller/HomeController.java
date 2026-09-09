package com.example.demo.controller;

import com.example.demo.model.Pedido;
import com.example.demo.model.Produto;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.ProdutoService;
import com.example.demo.service.PedidoService;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.security.Principal;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/home")
    public String homePage(Model model, Principal principal) {

        Usuario usuario = null;
        if (principal != null) {
            usuario = usuarioRepository.findByEmail(principal.getName()).orElse(null);
        }

        List<Produto> produtos = produtoService.listar();
        List<Pedido> pedidos = pedidoService.listarTodos();

        model.addAttribute("usuario", usuario);
        model.addAttribute("produtos", produtos);
        model.addAttribute("anuncios", produtos);
        model.addAttribute("pedidos", pedidos);

        // Indicadores do dashboard (dados reais)
        long pendentes = pedidos.stream()
                .filter(p -> p.getStatus() != null
                        && !"ENTREGUE".equalsIgnoreCase(p.getStatus())
                        && !"CANCELADO".equalsIgnoreCase(p.getStatus()))
                .count();
        long entregues = pedidos.stream()
                .filter(p -> "ENTREGUE".equalsIgnoreCase(p.getStatus()))
                .count();
        double valorTotal = pedidos.stream().mapToDouble(Pedido::getTotal).sum();
        long estoqueBaixo = produtos.stream()
                .filter(pr -> pr.getQuantidade() != null
                        && pr.getQuantidade() <= (pr.getEstoqueMinimo() != null ? pr.getEstoqueMinimo() : 5))
                .count();

        model.addAttribute("totalProdutos", produtos.size());
        model.addAttribute("pedidosPendentes", pendentes);
        model.addAttribute("pedidosEntregues", entregues);
        model.addAttribute("valorTotalPedidos", valorTotal);
        model.addAttribute("produtosEstoqueBaixo", estoqueBaixo);

        boolean mostrarTutorial = usuario != null && Boolean.TRUE.equals(usuario.getPrimeiroAcesso());
        model.addAttribute("mostrarTutorial", mostrarTutorial);

        return "home";
    }

    @PostMapping("/tutorial/concluir")
    public String concluirTutorial(Principal principal) {
        if (principal != null) {
            usuarioRepository.findByEmail(principal.getName()).ifPresent(u -> {
                u.setPrimeiroAcesso(false);
                usuarioRepository.save(u);
            });
        }
        return "redirect:/home";
    }

    @GetMapping("/anunciar")
    public String paginaAnuncio() {
        return "anunciar";
    }

    @PostMapping("/anunciar")
    public String salvarProduto(@RequestParam("imagemFile") MultipartFile file, Produto produto) {
        salvarImagem(file, produto);
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
                    "Pedido #" + pedido.getId()
                            + " | Cliente: " + pedido.getClienteNome()
                            + " | Total: R$ " + pedido.getTotal()
                            + " | Status: " + pedido.getStatus()
            ));
        }

        document.close();
    }

    @GetMapping("/cadastro")
    public String cadastroPage() {
        return "cadastro";
    }

    @PostMapping("/cadastro")
    public String cadastrarUsuario(Usuario usuario,
                                   @RequestParam(value = "confirmarSenha", required = false) String confirmarSenha) {

        if (usuario.getSenha() == null
                || !usuario.getSenha().matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&]).{8,}$")) {
            return "redirect:/cadastro?erro=senha";
        }

        if (confirmarSenha == null || !usuario.getSenha().equals(confirmarSenha)) {
            return "redirect:/cadastro?erro=confirmacao";
        }

        if (usuario.getEmail() != null && usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return "redirect:/cadastro?erro=email";
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setCargo("ROLE_USER");
        usuario.setPrimeiroAcesso(true);

        usuarioRepository.save(usuario);

        return "redirect:/?cadastro=sucesso";
    }

    @GetMapping("/anuncio/editar/{id}")
    public String editarAnuncio(@PathVariable Long id, Model model) {
        Produto produto = produtoService.buscarPorId(id);
        model.addAttribute("produto", produto);
        return "anunciar";
    }

    @PostMapping("/anuncio/editar/{id}")
    public String atualizar(@PathVariable Long id,
                            @RequestParam("imagemFile") MultipartFile file,
                            Produto produto) {
        salvarImagem(file, produto);
        produto.setId(id);
        produtoService.salvar(produto);
        return "redirect:/home";
    }

    private void salvarImagem(MultipartFile file, Produto produto) {
        try {
            if (file != null && !file.isEmpty()) {
                String nomeArquivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                String caminho = System.getProperty("user.dir")
                        + "/demo/src/main/resources/static/uploads/";

                File pasta = new File(caminho);
                if (!pasta.exists()) {
                    pasta.mkdirs();
                }

                File destino = new File(pasta, nomeArquivo);
                file.transferTo(destino);

                produto.setImagemUrl("/uploads/" + nomeArquivo);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
