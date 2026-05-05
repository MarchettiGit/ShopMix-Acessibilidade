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
				u.setEmail("admin@email.com");
				u.setSenha(encoder.encode("123456"));
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
				p1.setProdutoImagem("/assets/imgs/Clientes/poltrona.jpg");
				p1.setFrete(15);
				p1.setTotal(120);
				p1.setStatus("PENDENTE");

				Pedido p2 = new Pedido();
				p2.setClienteNome("João");
				p2.setProdutoImagem("/resources/static/assets/imgs/Clientes/poltrona.jpg");
				p2.setFrete(20);
				p2.setTotal(200);
				p2.setStatus("PENDENTE");

				repo.save(p1);
				repo.save(p2);
			}
		};
	}
}