# Urban Risk Intelligence Platform

**Global Solution 2026 — FIAP**  
Curso: Bacharelado em Engenharia de Computação · Disciplina: Advanced Programming And Mobile Dev · Prof.: Hete Caetano dos Santos

Sistema para monitoramento de riscos urbanos (alagamentos, ilhas de calor e interrupções de serviços essenciais). O backend em **Java/Spring Boot** recebe dados de sensores, bases públicas e relatos comunitários, calcula a prioridade de cada ocorrência e indica a **origem** e o **nível de confiança** do dado. O aplicativo em **React Native** (TypeScript) exibe o painel de monitoramento, os alertas priorizados e o histórico de eventos.

## Integrantes

| Nome completo | RM | Turma |
| ----- | ----- | ----- |
| Felipe Pinheiro Sombra | 559167 | 3ECA |
| Fernando de Freitas Carvalho | 555194 | 3ECR |
| Nicolas Alves dos Santos | 558993 | 3ECR |

## Visão geral

```
 Sensores · Bases públicas · Registros comunitários
          │  POST /api/ingestao/*   (chave X-API-Key por origem)
          ▼
 ┌──────────── Backend Spring Boot ─────────────┐
 │  api → service → repository → domain         │
 │            └→ analise (priorização)          │
 └──────────────────┬───────────────────────────┘
                    │ SQL (H2 em dev · PostgreSQL)
                    ▼
 App React Native ◄── GET /api/alertas e /api/eventos (a cada 5 s)
```

```
backend/             API REST (Spring Boot 3, Java 17)
mobile/              Aplicativo mobile (Expo SDK 58, React Native, TypeScript)
docker-compose.yml   Configuração para rodar backend + PostgreSQL
```

## Como executar

### Backend

Requisitos: JDK 17+ e Maven 3.9+.

```bash
cd backend
mvn test
mvn spring-boot:run -Dspring-boot.run.profiles=demo
```

O perfil `demo` ativa o simulador de sensores (enviando uma leitura a cada 3 s) e configura chaves de API de demonstração. Sem esse perfil, a API inicia sem dados e aguarda requisições externas. O servidor sobe em `http://localhost:8080`.

### App mobile

Requisitos: Node 20+ e o aplicativo **Expo Go** instalado no celular (ou emulador). Com o backend rodando:

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code no Expo Go. O celular e o computador devem estar na **mesma rede Wi-Fi**, com a porta 8080 liberada no firewall. O app identifica o IP do computador automaticamente na rede local; caso precise definir manualmente (como ao usar `--tunnel`), rode:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080 npx expo start
```

No emulador Android, o endereço padrão é `http://10.0.2.2:8080`.

### Docker (opcional): backend + PostgreSQL

```bash
cp .env.example .env     # preencha DB_SENHA e as chaves de API
docker compose up --build
```

Para ativar o simulador junto com o PostgreSQL, defina `PERFIL=postgres,demo` no `.env`.

### Testes

```bash
cd backend && mvn test             # JUnit (testes unitários e de integração)
cd mobile && npm test              # Jest
cd mobile && npm run typecheck     # Verificação de tipos TypeScript
```

## API

| Método | Rota | Chave | Descrição |
| ----- | ----- | :---: | ----- |
| POST | `/api/ingestao/sensores` | sim | Recebe leitura de sensor e calcula a gravidade no servidor |
| POST | `/api/ingestao/bases-publicas` | sim | Recebe lote (até 500 itens) de ocorrências de bases públicas |
| POST | `/api/ingestao/comunitario` | sim | Recebe relato comunitário sem dados pessoais |
| GET | `/api/eventos?tipo=&origem=&limite=` | não | Lista eventos do mais recente ao mais antigo (máx. 200) |
| GET | `/api/eventos/{id}` | não | Busca detalhes de um evento específico |
| GET | `/api/alertas?tipo=&limite=` | não | Lista alertas priorizados das últimas 24 h (padrão 20, máx. 100) |
| GET | `/actuator/health` | não | Verifica o status da API (`/liveness` e `/readiness`) |

Valores aceitos nos parâmetros:
- `tipo`: `ALAGAMENTO`, `ILHA_DE_CALOR`, `INTERRUPCAO_SERVICO`
- `origem`: `SENSOR`, `BASE_PUBLICA`, `REGISTRO_COMUNITARIO`
- `gravidade`: `BAIXA`, `MODERADA`, `ALTA`, `CRITICA`

Exemplos de uso:

```bash
curl -X POST http://localhost:8080/api/ingestao/sensores \
  -H "Content-Type: application/json" -H "X-API-Key: demo-sensores" \
  -d '{"sensorId":"SENSOR-12","tipo":"ALAGAMENTO","valor":110,"latitude":-23.65,"longitude":-46.85}'

curl -X POST http://localhost:8080/api/ingestao/comunitario \
  -H "Content-Type: application/json" -H "X-API-Key: demo-comunitario" \
  -d '{"tipo":"ALAGAMENTO","gravidade":"ALTA","latitude":-23.65,"longitude":-46.85,"descricao":"Rua alagada"}'

curl "http://localhost:8080/api/alertas?limite=5"
```

### Origem e confiança

Toda resposta retorna `origem` e `confianca`. A origem é determinada pela rota utilizada na ingestão, e o nível de confiança segue essa fonte:
- Sensor: `ALTA`
- Base pública: `MEDIA`
- Registro comunitário: `BAIXA`

### Cálculo de prioridade dos alertas

Cada evento recebe uma pontuação de 0 a 100 baseada em quatro critérios:

| Fator | Peso | Regra de cálculo |
| ----- | ----- | ----- |
| Gravidade | 45% | baixa: 0,25 · moderada: 0,50 · alta: 0,75 · crítica: 1,00 |
| Confiança | 20% | baixa: 0,40 · média: 0,70 · alta: 1,00 |
| Recência | 20% | decaimento exponencial conforme a meia-vida do risco (alagamento: 3 h, calor: 6 h, interrupção: 4 h) |
| Corroboração | 15% | soma das confianças de eventos do mesmo tipo em um raio de 1 km nas últimas 2 h (limite em 3,0) |

Classificação final: `ALTA` (65 pontos ou mais), `MEDIA` (40 a 64 pontos) e `BAIXA` (abaixo de 40 pontos). Para sensores, a gravidade é definida por faixas de leitura (alagamento em cm: 30/60/100; calor em $^\circ\text{C}$: 32/36/40; interrupção em % de clientes afetados: 5/20/50).

## App mobile

| Tela | O que exibe |
| ----- | ----- |
| Painel | Resumo de alertas por prioridade, contagem por tipo de risco e os 3 mais urgentes |
| Alertas | Lista ordenada por prioridade com filtro por tipo |
| Eventos | Histórico de eventos com filtros por tipo e origem do dado |
| Detalhe do alerta | Pontuação total, peso de cada fator, origem, nível de confiança e botão para abrir no mapa |

A atualização ocorre automaticamente a cada 5 s e também ao puxar a lista para baixo.

### Resiliência e modo offline

- **Queda do servidor:** se a API ficar indisponível, o app mantém os últimos dados carregados na tela e exibe um banner vermelho informando a falha, o horário da última atualização e o botão "Tentar agora".
- **Reconexão automática:** o app verifica a conexão a cada 5 s. Assim que o servidor volta, um banner verde confirma o retorno e a sincronização continua normalmente.

### Notificações locais

- O app dispara uma notificação local sempre que surge um novo alerta de prioridade `ALTA` (tocando na notificação, o usuário vai direto para a tela de detalhes).
- Existe um intervalo mínimo de 30 s entre notificações para evitar excesso de avisos. Caso a permissão seja negada no aparelho, o Painel exibe um aviso com atalho para os ajustes do sistema.

### Acessibilidade

- Rótulos descritivos nos cartões para leitura por voz (VoiceOver / TalkBack).
- Indicação de prioridade combinando cor, ícone e texto, com contraste mínimo de 4,5:1.
- Áreas de toque com pelo menos 48 dp e suporte ao redimensionamento de fonte do sistema.

## Segurança e privacidade

O sistema não exige cadastro, login nem coleta identificadores do dispositivo do usuário.

| Medida | Implementação |
| ----- | ----- |
| Minimização de dados | Registros comunitários não pedem nome, telefone ou documento |
| Anonimização | Padrões de e-mail, telefone e CPF são removidos do texto antes de salvar no banco |
| Localização aproximada | Coordenadas de relatos comunitários são arredondadas para ~110 m |
| Retenção | Eventos com mais de 30 dias são removidos automaticamente às 03:00 (`urbanrisk.retencao.dias`) |
| Autenticação de escrita | Rotas de ingestão exigem o header `X-API-Key` específico para cada origem |
| Variáveis de ambiente | Chaves de API e senhas ficam no `.env` (fora do Git) e nunca são embutidas no app mobile |

Em ambiente de produção, as chaves são configuradas via `URBANRISK_SEGURANCA_CHAVE_SENSORES`, `URBANRISK_SEGURANCA_CHAVE_BASES_PUBLICAS` e `URBANRISK_SEGURANCA_CHAVE_COMUNITARIO`.

## Escalabilidade e disponibilidade

- **Backend stateless:** a API não guarda estado em memória, permitindo escalar múltiplas instâncias conectadas ao PostgreSQL (`PERFIL=postgres`).
- **Controle de carga:** limites máximos nas consultas (200 eventos, 100 alertas), janela de 500 eventos recentes para o cálculo de prioridade e ingestão em lote.
- **Monitoramento:** endpoints `/actuator/health`, `/liveness` e `/readiness` configurados para verificação de saúde dos contêineres.
- **Melhorias futuras:** cache de curta duração em `/api/alertas` (complexidade atual $O(n^2)$), índice espacial com PostGIS, mensageria (Kafka/RabbitMQ) para alto volume de sensores, migrações com Flyway e push remoto (FCM/APNs).

## Roteiro de demonstração

1. **Backend:** iniciar com `cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=demo` e testar `http://localhost:8080/api/alertas?limite=5` no navegador.
2. **Mobile:** rodar `cd mobile && npx expo start`, abrir no celular e mostrar o painel atualizando em tempo real, os filtros e o detalhamento da pontuação de um alerta.
3. **Notificação:** aguardar a chegada de um novo alerta de prioridade alta gerado pelo simulador.
4. **Segurança na API:** enviar um `POST` sem chave (retornando `401`) e outro com `X-API-Key: demo-sensores` (retornando `201`).
5. **Tolerância a falhas:** derrubar o backend com `Ctrl+C`, mostrar o banner de desconexão no app e os dados mantidos em cache.
6. **Reconexão:** subir o backend novamente e validar o banner verde de reconexão e a retomada das atualizações.