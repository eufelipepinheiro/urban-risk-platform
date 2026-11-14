package br.com.urbanrisk.repository;

import br.com.urbanrisk.domain.Evento;
import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventoRepository extends JpaRepository<Evento, Long>, JpaSpecificationExecutor<Evento> {

    // Remoção em lote direto no banco: evita carregar na memória todos os eventos expirados.
    @Modifying
    @Query("delete from Evento e where e.ocorridoEm < :limite")
    int removerOcorridosAntesDe(@Param("limite") Instant limite);
}
