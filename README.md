# Urban Risk Intelligence Platform

> **Global Solution 2026** — Disciplina: *Advanced Programming And Mobile Dev*  
> **Curso:** Bacharelado em Engenharia de Computação (3º Ano) | **FIAP**

---

## Sobre o Projeto

A **Urban Risk Intelligence Platform** é uma solução completa para monitoramento, análise e priorização de riscos cotidianos em áreas urbanas, como alagamentos, ilhas de calor e interrupções de serviços essenciais. 

A plataforma consolida dados de **sensores**, **bases públicas** e **registros comunitários**, aplicando um motor de decisão para avaliar o nível de confiança das informações e acionar alertas prioritários para moradores e agentes locais.

---

## Tecnologias Utilizadas

* **Backend (Spring Boot 3.3):** Java 17, Spring Data JPA, Spring Validation, Spring Actuator, Banco H2 (persistência local em arquivo).
* **Frontend Mobile (React Native):** JavaScript/TypeScript, Expo, React Navigation, Axios.
* **Inteligência & Análise:** Algoritmo de ponderação e score de priorização de riscos baseado em severidade, localização e confiabilidade da fonte.

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
