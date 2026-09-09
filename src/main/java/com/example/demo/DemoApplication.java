package com.example.demo;

import com.example.demo.model.Pedido;
import com.example.demo.model.Usuario;
import com.example.demo.repository.PedidoRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public CommandLineRunner criarUsuario(UsuarioRepository repo, BCryptPasswordEncoder encoder) {
        return args -> {
            if (repo.findByEmail("admin@email.com").isEmpty()) {
                Usuario u = new Usuario();
                u.setNome("Usuário Demonstração");
                u.setEmail("admin@email.com");
                u.setSenha(encoder.encode("123456"));
                u.setCargo("ROLE_USER");
                u.setNomeEmpreendimento("Loja Exemplo");
                u.setDescricaoEmpreendimento("Empreendimento de demonstração da ShopMix.");
                u.setPrimeiroAcesso(true);
                repo.save(u);

                System.out.println("Usuário criado!");
            }
        };
    }

    @Bean
    public CommandLineRunner criarPedidos(PedidoRepository repo) {
        return args -> {
            if (repo.count() == 0) {

                Pedido p1 = new Pedido();
                p1.setClienteNome("Murilo");
                p1.setProdutoNome("Poltrona Branca");
                p1.setProdutoImagem("/assets/imgs/Clientes/poltrona.jpg");
                p1.setQuantidade(1);
                p1.setFrete(15);
                p1.setTotal(120);
                p1.setStatus("PENDENTE");
                p1.setData(LocalDateTime.now().minusDays(2));

                Pedido p2 = new Pedido();
                p2.setClienteNome("João");
                p2.setProdutoNome("Poltrona Branca");
                p2.setProdutoImagem("/assets/imgs/Clientes/poltrona.jpg");
                p2.setQuantidade(2);
                p2.setFrete(20);
                p2.setTotal(200);
                p2.setStatus("PROCESSAMENTO");
                p2.setData(LocalDateTime.now().minusDays(1));

                Pedido p3 = new Pedido();
                p3.setClienteNome("Ana");
                p3.setProdutoNome("Poltrona Branca");
                p3.setProdutoImagem("/assets/imgs/Clientes/poltrona.jpg");
                p3.setQuantidade(1);
                p3.setFrete(0);
                p3.setTotal(150);
                p3.setStatus("ENTREGUE");
                p3.setData(LocalDateTime.now().minusDays(5));

                repo.save(p1);
                repo.save(p2);
                repo.save(p3);
            }
        };
    }
}
