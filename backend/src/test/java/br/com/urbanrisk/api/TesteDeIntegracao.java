package br.com.urbanrisk.api;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

// Todas as classes compartilham a mesma configuração, o que reaproveita o contexto do Spring entre elas.
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:urbanrisk-teste",
        "urbanrisk.seguranca.chave-sensores=" + ChavesDeTeste.SENSORES,
        "urbanrisk.seguranca.chave-bases-publicas=" + ChavesDeTeste.BASES_PUBLICAS,
        "urbanrisk.seguranca.chave-comunitario=" + ChavesDeTeste.COMUNITARIO
})
@AutoConfigureMockMvc
@Transactional
public @interface TesteDeIntegracao {
}
