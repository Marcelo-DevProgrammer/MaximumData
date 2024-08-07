import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:5000';

function App() {
    const [form, setForm] = useState('menu');
    const [produtos, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]);
    const [saidas, setSaidas] = useState([]);

    const [produtoEditado, setProdutoEditado] = useState(null);
const [editarProdutoId, setEditarProdutoId] = useState(null);

const handleEditProduct = (produto) => {
    setProdutoEditado(produto);
    setForm('editar');
};

const handleUpdateProduct = () => {
    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const data = document.getElementById('data').value;

    fetch(`${API_URL}/produtos/${editarProdutoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            quantidade: parseInt(quantidade, 10),
            data
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Produto atualizado com sucesso!');
        setProdutos(produtos.map(p => p.id === editarProdutoId ? data : p));
        setForm('menu');
    })
    .catch(error => {
        console.error('Erro ao atualizar produto:', error);
    });
};


    useEffect(() => {
        fetch(`${API_URL}/produtos`)
            .then(response => response.json())
            .then(data => setProdutos(data));

        fetch(`${API_URL}/vendas`)
            .then(response => response.json())
            .then(data => setVendas(data));
        
        fetch(`${API_URL}/saidas`)
            .then(response => response.json())
            .then(data => setSaidas(data));
    }, []);

    const showForm = (form) => {
        setForm(form);
    };

    const handleSaveProduct = () => {
        const nome = document.getElementById('nome').value;
        const quantidade = document.getElementById('quantidade').value;
        const data = document.getElementById('data').value;

        fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                quantidade: parseInt(quantidade, 10),
                data
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Produto cadastrado com sucesso!');
            setProdutos([...produtos, data]);  // Atualiza a lista de produtos
            setForm('menu');  // Volta para o menu principal
        })
        .catch(error => {
            console.error('Erro ao cadastrar produto:', error);
        });
    };

    const handleSaveSale = () => {
      const produtoId = document.getElementById('produto').value;
      const quantidade = document.getElementById('quantidade').value;
      const data = document.getElementById('data').value;
      const valor = document.getElementById('valor').value;
  
      const produto = produtos.find(p => p.id === produtoId);
  
      if (!produto) {
          alert('Produto não encontrado.');
          return;
      }
  
      if (quantidade > produto.quantidade) {
          alert('Quantidade solicitada é maior do que o estoque disponível.');
          return;
      }
  
      // Registrar a venda
      fetch(`${API_URL}/vendas`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              produtoId: parseInt(produtoId, 10),
              quantidade: parseInt(quantidade, 10),
              data,
              valor: parseFloat(valor)
          })
      })
      .then(response => response.json())
      .then(data => {
          alert('Venda registrada com sucesso!');
  
          // Atualizar estoque do produto
          fetch(`${API_URL}/produtos/${produtoId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  ...produto,
                  quantidade: produto.quantidade - parseInt(quantidade, 10)
              })
          })
          .then(() => {
              setProdutos(produtos.map(p => p.id === produtoId ? { ...p, quantidade: p.quantidade - parseInt(quantidade, 10) } : p));
              setVendas([...vendas, data]);  // Atualiza a lista de vendas
              setForm('menu');  // Volta para o menu principal
          })
          .catch(error => {
              console.error('Erro ao atualizar estoque:', error);
          });
      })
      .catch(error => {
          console.error('Erro ao registrar venda:', error);
      });
  };
  
  

    const handleSaveExit = () => {
        const tipo_saida = document.getElementById('tipo_saida').value;
        const valor = document.getElementById('valor').value;
        const data = document.getElementById('data').value;

        fetch(`${API_URL}/saidas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo_saida,
                valor: parseFloat(valor),
                data
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Saída registrada com sucesso!');
            setSaidas([...saidas, data]);  // Atualiza a lista de saídas
            setForm('menu');  // Volta para o menu principal
        })
        .catch(error => {
            console.error('Erro ao registrar saída:', error);
        });
    };

    const renderForm = () => {
      switch (form) {
          case 'cadastrar':
              return (
                  <>
                      <h2>Cadastrar Produto</h2>
                      <label htmlFor="nome">Nome do Produto</label>
                      <input type="text" id="nome" name="nome" placeholder="Nome do Produto" />
                      <label htmlFor="quantidade">Quantidade em Estoque</label>
                      <input type="number" id="quantidade" name="quantidade" placeholder="Quantidade" />
                      <label htmlFor="data">Data de Inclusão</label>
                      <input type="date" id="data" name="data" />
                      <button onClick={handleSaveProduct}>Salvar</button>
                      <button onClick={() => showForm('menu')}>Voltar</button>
                  </>
              );
          case 'editar':
              return produtoEditado ? (
                  <>
                      <h2>Editar Produto</h2>
                      <label htmlFor="nome">Nome do Produto</label>
                      <input type="text" id="nome" name="nome" defaultValue={produtoEditado.nome} />
                      <label htmlFor="quantidade">Quantidade em Estoque</label>
                      <input type="number" id="quantidade" name="quantidade" defaultValue={produtoEditado.quantidade} />
                      <label htmlFor="data">Data de Inclusão</label>
                      <input type="date" id="data" name="data" defaultValue={produtoEditado.data} />
                      <button onClick={handleUpdateProduct}>Atualizar</button>
                      <button onClick={() => showForm('editarmenu')}>Voltar</button>
                  </>
              ) : (
                  <p>Produto não encontrado.</p>
              );
          case 'venda':
              return (
                  <>
                      <h2>Registrar Venda</h2>
                      <label htmlFor="produto">Selecionar Produto</label>
                      <select id="produto" name="produto">
                          {produtos.map(produto => (
                              <option key={produto.id} value={produto.id}>
                                  {produto.nome}
                              </option>
                          ))}
                      </select>
                      <label htmlFor="quantidade">Quantidade</label>
                      <input type="number" id="quantidade" name="quantidade" placeholder="Quantidade" />
                      <label htmlFor="data">Data</label>
                      <input type="date" id="data" name="data" />
                      <label htmlFor="valor">Valor (R$)</label>
                      <input type="text" id="valor" name="valor" placeholder="Valor em R$" />
                      <button onClick={handleSaveSale}>Salvar</button>
                      <button onClick={() => showForm('menu')}>Voltar</button>
                  </>
              );
          case 'saida':
              return (
                  <>
                      <h2>Registrar Saída</h2>
                      <label htmlFor="tipo_saida">Tipo de Saída</label>
                      <input type="text" id="tipo_saida" name="tipo_saida" placeholder="Tipo de Saída" />
                      <label htmlFor="valor">Valor (R$)</label>
                      <input type="text" id="valor" name="valor" placeholder="Valor em R$" />
                      <label htmlFor="data">Data</label>
                      <input type="date" id="data" name="data" />
                      <button onClick={handleSaveExit}>Salvar</button>
                      <button onClick={() => showForm('menu')}>Voltar</button>
                  </>
              );
          case 'editarmenu':
              return (
                  <>
                      <h2>Produtos</h2>
                      <ul>
                          {produtos.map(produto => (
                              <li key={produto.id}>
                                  {produto.nome} - {produto.quantidade}
                                  <button onClick={() => handleEditProduct(produto)}>Editar</button>
                              </li>
                          ))}
                      </ul>
                      <button onClick={() => showForm('menu')}>Voltar</button>
                  </>
              );
          case 'menu':
          default:
              return (
                  <>
                      <h1>Bem-vindo ao MAXIMUM DATA</h1>
                  </>
              );
      }
  };
  
  
  

    return (
        <div className="container">
            <div id="form-container" className="form-container">
                {renderForm()}
            </div>
            <div className="menu-bar">
                <button onClick={() => showForm('cadastrar')}>Cadastrar Produto</button>
                <button onClick={() => showForm('editarmenu')}>Editar Produtos</button>
                <button onClick={() => showForm('venda')}>Venda</button>
                <button onClick={() => showForm('saida')}>Saída</button>
                <button onClick={() => showForm('menu')}>Menu</button>
            </div>
            
        </div>
    );
}

export default App;
