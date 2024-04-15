import { useEffect, useState } from 'react'
import './App.css'
import { format } from 'date-fns'

function App() {
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [datetime, setDatetime] = useState('')
const [transactions, setTransactions] = useState('')

useEffect(() => {
  getTransactions().then(transactions => {
    const sortedTransactions = transactions.slice().sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    setTransactions(sortedTransactions);
  });
}, []);

async function getTransactions() {
  const url = "https://localhost:5174"+"/transactions";
  const response = await fetch(url);
  return await response.json();
}

const addNewTransaction = async (e) => {
  e.preventDefault();
  //const url = process.env.REACT_APP_API_URL;
  const url = "https://localhost:5174"+"/transaction"
  const price = name.split(' ')[0]
  const timeDate = datetime.split('.')[0] 
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length+1),
        description,
        datetime: timeDate
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();
    console.log('result', json);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Handle errors here
  }
  setName('');
  //setDatetime('');
  setDescription('');
}

let balance = 0;
for (const transaction of transactions) {
  balance = balance + transaction.price
}

balance = balance.toFixed(2)
const cents = balance.split('.')[1]
balance = balance.split('.')[0]

  return (
    <div>
      <div>
        <h1 className='title'>Personal-Expenses Tracker</h1>
        <a href="/" className='refresh'><i className="fa-solid fa-arrows-rotate"></i></a>
      </div>
      <main>
      <h2>${balance}<span>{cents}</span></h2>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            type="text" 
            placeholder='+150 Kindle'/>
          <input
            id='date' 
            value={datetime} 
            onChange={e => setDatetime(e.target.value)} 
            type="datetime-local"/>
        </div>
        <div className='description'>
          <input
            id='desc' 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            type="text" placeholder='Description' />
        </div>
        <button type='submit' className='add'>Add new transaction</button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div className='transaction'>
          <div className='left'>
            <div className='name'>{transaction.name}</div>
            <div className='description'>{transaction.description}</div>
          </div>
          <div className='right'>
            <div className={'price ' +(transaction.price < 0 ? 'red' : 'green')}>{transaction.price}</div>
            <div className='datetime'>{format(new Date(transaction.datetime), 'dd/MM/yyyy hh:mm a')}</div>
          </div>
        </div>
        ))}   
      </div>
    </main>
    </div>
    
  )
}

export default App
