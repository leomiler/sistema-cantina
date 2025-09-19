# Prompt Atualizado: Sistema simples de emissão de tickets com controle de estoque (58mm)

## Objetivo
Crie um **sistema extremamente simples** para uma cantina emitir tickets de venda, controlar o **estoque de produtos**, e gerar um **relatório do dia**, com impressão em **impressoras térmicas 58 mm**.  

## Escopo (somente isto)
1. **Cadastro de produtos**
   - nome, preço, status ativo/inativo  
   - **estoque inicial e estoque atual** (quantidade disponível)  
   - permitir ajuste manual de estoque quando necessário  

2. **Vendas** em uma única tela
   - lista de produtos com busca rápida  
   - exibir estoque disponível ao lado do produto  
   - seleção de quantidade (bloquear se maior que o estoque disponível)  
   - totalizador da venda  
   - forma de pagamento: **Dinheiro** ou **PIX** (somente seleção; sem integração de gateway)  
   - botão **Emitir Ticket** → imprime ticket 58 mm e **abate o estoque** automaticamente  

3. **Resumo do dia**
   - total vendido (R$), total de cupons, total por forma de pagamento  
   - ranking de produtos (quantidade e valor)  
   - saldo de estoque dos produtos  
   - botão **Imprimir Relatório Diário** (58 mm)  

4. **Reimpressão de tickets**
   - lista de vendas do dia com ID do cupom, hora e total  
   - busca por **ID**  
   - botão **Reimprimir**  

5. **Controle de estoque**
   - estoque atualizado automaticamente a cada venda  
   - impedir vendas quando não há saldo suficiente  
   - ajuste manual possível via tela de produtos  

> Fora de escopo: múltiplos caixas, integrações externas, relatórios complexos.

---

## Público-alvo e plataforma
- **PWA mobile-first** (funcionar bem no celular; “Adicionar à tela inicial”).  
- Impressão via **print CSS 58 mm** (modo retrato, largura ~58 mm).  
- Opcional: envio ESC/POS via WebUSB/WebBluetooth.  

---

## Arquitetura e stack sugeridos
- Frontend: **React + Vite** (ou Next.js), **TypeScript**, **Tailwind**.  
- Backend: **Node.js + Express** (API REST).  
- Banco de dados: **MySQL** (preferência do usuário).  
- ORM: **Prisma** ou **Knex** para CRUD.  

---

## Impressão 58 mm
### Ticket
```
NOME DA CANTINA
Data/Hora: 18/09/2025 20:10
Cupom: 000123
------------------------------
2x Cachorro Quente   20,00
1x Refri Lata         6,00
------------------------------
TOTAL                26,00
Pgto: PIX
Obrigado e volte sempre!
```

### Relatório diário
```
RELATÓRIO DIÁRIO - 18/09/2025
------------------------------
Vendas: 37 cupons
Total R$               1.254,00
Dinheiro R$              712,00
PIX R$                   542,00
------------------------------
TOP PRODUTOS (Qtd / R$)
1) Cachorro Quente   22  440,00
2) Refri Lata        15   90,00
------------------------------
ESTOQUE FINAL
Cachorro Quente     10 unid
Refri Lata          25 unid
```

---

## Modelo de dados (MySQL)

```sql
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque_inicial INT DEFAULT 0,
  estoque_atual INT DEFAULT 0,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  forma_pagamento ENUM('DINHEIRO','PIX') NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

CREATE TABLE venda_itens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  venda_id BIGINT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Índices úteis
CREATE INDEX idx_vendas_data ON vendas (criado_em);
CREATE INDEX idx_itens_venda ON venda_itens (venda_id);
```

---

## Lógica do backend
- `POST /api/vendas`  
  1. Recebe itens e forma de pagamento.  
  2. Valida se cada produto tem `estoque_atual >= quantidade`.  
  3. Se válido, insere `vendas` e `venda_itens`.  
  4. Atualiza `estoque_atual = estoque_atual - quantidade`.  
  5. Retorna dados do cupom para impressão.  

- `GET /api/produtos` → lista com nome, preço, estoque_atual.  
- `PATCH /api/produtos/:id/estoque` → ajuste manual de estoque.  
- `GET /api/resumo?data=YYYY-MM-DD` → resumo do dia + estoque.  

---

## Telas
1. **Produtos**  
   - tabela com Nome, Preço, Estoque Atual, Ativo  
   - botões para cadastrar e ajustar estoque  

2. **Vendas**  
   - lista de produtos (com estoque disponível exibido)  
   - seleção de quantidade (desabilitar se zerado)  
   - total + seletor de forma de pagamento  
   - botão Emitir Ticket  

3. **Resumo**  
   - totais do dia (R$, cupons, formas de pagamento)  
   - ranking de produtos  
   - estoque final  
   - botão Imprimir Relatório  

4. **Reimpressão**  
   - lista de vendas com ID e hora  
   - botão Reimprimir  

---

## Requisitos não-funcionais
- Persistência confiável em **MySQL**.  
- Código limpo e modular.  
- Acessibilidade básica (botões grandes, leitura fácil).  
- Relatórios e tickets otimizados para impressão 58 mm.  

---

👉 Esse update mantém o sistema **simples**, mas garante **controle de estoque em tempo real**.
