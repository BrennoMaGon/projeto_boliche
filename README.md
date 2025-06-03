# GERENCIADOR DE BOLICHE

# Criador
Brenno Magalhães Gonçalves

--- 
Bem-vindo(a) ao Gerenciador de Boliche! Este README irá guiá-lo(a) na configuração e execução do programa em sua máquina local.

### Sobre o Programa

Este é um **gerenciador de boliche** desenvolvido para administradores. Com ele, você pode:

* **Rankear** jogadores
* **Editar** o ranking existente
* **Excluir** tabelas de ranking
* **Definir usuários** e o número de **rodadas** para cada um

---

### Tecnologias Utilizadas

O programa foi construído utilizando as seguintes tecnologias:

* **Back-end:** **PHP** para a lógica de servidor e sincronização com o banco de dados.
* **Banco de Dados:** **SQL** para armazenamento e gestão das informações.
* **Front-end:**
    * **HTML:** Estrutura da página.
    * **CSS:** Estilização e design da interface.
    * **JavaScript:** Interatividade e funcionalidades dinâmicas da página.
---

### Pré-requisitos

Para que o programa funcione corretamente, você precisará ter o **XAMPP** ou outro ambiente de SERVIDOR LOCAL instalado em sua máquina.

---

### Instalação e Configuração

Siga os passos abaixo para configurar o ambiente:

1.  **Mover a pasta do programa:**
    Após instalar o **XAMPP**, coloque a pasta do programa dentro do diretório `htdocs` do XAMPP. Normalmente, o caminho em sistemas Windows é:
    `C:\xampp\htdocs`

2. **Ative Apache e SQL**
    Acesse o painel de controle do **XAMP** e clique em `Start` para iniciar o `Apache` e o `SQL`  

3.  **Importar o banco de dados:**
    Acesse `localhost/phpmyadmin` no seu navegador e importe o arquivo de banco de dados (`.sql`) que está incluído na pasta do programa.

---

### Acessando o Programa

Com os passos acima concluídos, você pode acessar a página principal do programa. Basta digitar o seguinte endereço no seu navegador:

`localhost/app`

Agora você deve conseguir utilizar a aplicação!

