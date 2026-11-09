# Urban Risk Intelligence Platform

> **Global Solution 2026** — Disciplina: *Advanced Programming And Mobile Dev*  
> **Curso:** Bacharelado em Engenharia de Computação (3º Ano) | **FIAP**

---

## Sobre o Projeto

A **Urban Risk Intelligence Platform** é uma solução completa para monitoramento, análise e priorização de riscos cotidianos em áreas urbanas, como alagamentos, ilhas de calor e interrupções de serviços essenciais. 

A plataforma consolida dados de **sensores**, **bases públicas** e **registros comunitários**, aplicando um motor de decisão para avaliar o nível de confiança das informações e acionar alertas prioritários para moradores e agentes locais.

---

## Tecnologias Utilizadas

- **Backend (Spring Boot 3.3):** Java 17, Spring Data JPA, Spring Validation, Spring Actuator, Banco H2 (persistência local em arquivo).
- **Frontend Mobile (React Native):** JavaScript/TypeScript, Expo, React Navigation, Axios.
- **Inteligência & Análise:** Algoritmo de ponderação e score de priorização de riscos baseado em severidade, localização e confiabilidade da fonte.

---

## Arquitetura do Sistema

O projeto segue a arquitetura em camadas no backend e padrão modular no mobile:

```text
urban-risk-platform/
├── backend/                  # API REST em Spring Boot (Java 17)
│   ├── src/main/java/br/com/urbanrisk/
│   │   ├── api/              # Controllers (Endpoints REST e DTOs)
│   │   ├── domain/           # Entidades de Domínio e Enums
│   │   ├── repository/       # Repositórios JPA (Interface com banco)
│   │   ├── service/          # Regras de Negócio e Algoritmo de Priorização
│   │   └── config/           # Configurações do sistema (Clock/Relógio)
│   └── src/test/             # Testes unitários e de integração
└── mobile/                   # Aplicativo React Native (Expo)
```

---

## Regras de Negócio & Conformidade

1. **Nível de Confiança por Origem:**
   - **SENSOR:** Alta confiança (*High*).
   - **BASE_PUBLICA:** Média confiança (*Medium*).
   - **REGISTRO_COMUNITARIO:** Baixa confiança (*Low*).

2. **Privacidade e LGPD:**
   - Registros comunitários não armazenam nome, contato, IP ou qualquer identificador pessoal do morador, garantindo total anonimato e proteção aos dados sensíveis.

3. **Recurso de IA e Priorização de Alertas:**
   - O motor de decisão calcula o score de emergência através do cruzamento entre a gravidade informada, o nível de confiança da fonte e a janela temporal, ordenando a exibição dos alertas de forma prioritária no aplicativo.

---

## Como Executar o Projeto

### Pré-requisitos

- Java JDK 17 instalado.
- Node.js (v18+) e gerenciador `npm` ou `yarn`.
- Expo Go no dispositivo móvel ou um emulador (Android Studio / Xcode).

### 1. Executando o Backend (Spring Boot)

1. Entre no diretório do backend:
   ```bash
   cd backend
   ```

2. Execute a suíte de testes automatizados:
   ```bash
   mvn test
   ```

3. Inicie o servidor Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
   *A API estará disponível em `http://localhost:8080` e os dados serão mantidos em `./backend/data`.*

4. **Verificação de Saúde (Healthcheck):**
   - Endpoint: `GET http://localhost:8080/actuator/health`

### 2. Executando o Aplicativo Mobile (React Native)

1. Em um novo terminal, entre na pasta do aplicativo:
   ```bash
   cd mobile
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

4. Abra o app no dispositivo físico escaneando o QR Code pelo **Expo Go**, ou pressione `a` (Android) / `i` (iOS) para executar no emulador.

---

## Integrantes do Grupo

Projeto desenvolvido para a **Global Solution** da disciplina **Advanced Programming And Mobile Dev**, ministrada pela **Prof.ª Hete Caetano dos Santos**.

| Nome | RM | Turma | E-mail |
| :--- | :---: | :---: | :--- |
| Felipe Pinheiro Sombra | 559167 | 3ECA | [RM559167@fiap.com.br](mailto:RM559167@fiap.com.br) |
| Fernando de Freitas Carvalho | 555194 | 3ECR | [RM555194@fiap.com.br](mailto:RM555194@fiap.com.br) |
| Nicolas Alves dos Santos | 558993 | 3ECR | [RM558993@fiap.com.br](mailto:RM558993@fiap.com.br) |
